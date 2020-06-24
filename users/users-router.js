const router = require("express").Router();
const Users = require("./users-model.js");
const Tickets = require("../tickets/tickets-model.js");

const Restricted = require('../auth/authenticate-middleware.js');

// @route GET /users/
// @desc Get all users information
// @ access Private
//localhost:4000/users
router.get('/', (req, res) => {
    Users.findUser()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.json(err)
        })
});
// @route GET /users/getid/:id/4
// @desc Get user informatin by id
// @ access Private
//localhost:4000/users/getid/1
router.get('/getid/:id', Restricted, (req, res) => {
    Users.findById(req.params.id)
        .then(user => {
            if (user) {
                res.json(user)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Could not get user", err })
        })
})


//localhost:4000/users/ticket
// @desc GET User tickets
// @access Private
//localhost:4000/users/
router.get('/ticket', Restricted, (req, res) => {
    const userid = req.user.id;
    if (req.user.role === 'student') {
        Users.findStudent(userid)
            .then(tickets => {
                res.status(200).json(tickets)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Unable to get tickets!!" })
            })
    } else if (req.user.role === 'helper') {
        Users.findAssignedTickets(userid)
            .then(tickets => {
                res.status(200).json(tickets)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Unable to get tickets!!" })
            })
    } else res.status(400).json({ message: "Please specify the user role!!" });
})

//Restricted only to helpers
// make sure to place ticketid in the :id 2
// body will require "id": 7 for techid
//localhost: 4000 / users / ticket / 2 / assign

router.post('/ticket/:id/assign', (req, res) => {
    const techid = req.user.id;
    const { id } = req.params;
    req.user.role === 'helper' ? Users.findAssignedTicketById(id)
        .then(ticket => {
            if (!ticket) {
                Users.assignTicket(techid, id)
                    .then(tickets => {
                        Tickets.update(id, { assigned: true })
                        res.status(200).json(tickets);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ message: "Failed to assign ticket." })
                    })
            } else res.status(400).json({ message: "Ticket has already been assigned." })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error assigning the ticket." })
        }) :
        res.status(400).json({ message: "Ticket assignment restricted to helpers only." });
});

//reassigned tickets back to the que removes from users list.
//localhost: 4000 / users / tickets / 4 / reassign
router.put('/tickets/:id/reassign', (req, res) => {
    const { id } = req.params;
    req.user.role === 'helper' ?
        Users.findAssignedTicketById(id)
        .then(ticket => {
            if (ticket) {
                if (ticket.techid) {
                    // Sets ticket assignment to false and deletes assigned ticket entry
                    return Tickets.update(id, { assigned: false })
                        .then(updatedTicket => {
                            Users.removeAsgTicket(id)
                                .then(() => {
                                    res.status(200).json(updatedTicket)
                                });
                        });
                } else res.status(400).json({ message: "Cannot reassign ticket if it is not assigned to you." })
            } else res.status(404).json({ message: "Ticket not found." });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error updating the ticket." })
        }) :
        res.status(400).json({ message: "Ticket updating restricted to helpers." });
});


// RESOLVE TICKET
// @route PUT api/users/tickets/:id/resolved
// @desc Update User
// @access Private
router.put('/ticket/:id/resolved', (req, res) => {
    const { id } = req.params;
    const userid = req.user.id;
    const { solution } = req.body;
    if (solution) {
        req.user.role === 'helper' ? Users.findAssignedTicketById(id)
            .then(ticket => {
                if (ticket) {
                    if (ticket.techid === userid) {
                        Tickets.update(id, { solution, resolved: true })
                            .then(updatedTicket => {
                                res.status(200).json(updatedTicket)
                            });
                    } else res.status(400).json({ message: "Unable to resolve unassigned ticket." })
                } else res.status(404).json({ message: "The ticket not found" });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Unable to update ticket." })
            }) :
            res.status(400).json({ message: "Ticket updating restricted to techs only." });
    } else res.status(400).json({ message: "Please add a solution to the resolved ticket." });
});

// @route Delete /users/tickets/:id
// @desc deletes tickets by id by the student
// @access Private
//https://devdeskapi.herokuapp.com/api/users/tickets/:id/
router.delete('/tickets/:id', Restricted, (req, res) => {
    const { id } = req.params;
    const userid = req.user.id;
    req.user.role === 'student' ? Users.findStdTicketById(id)
        .then(ticket => {
            if (ticket) {
                if (ticket.studentid === userid) {
                    Users.removeTicket(id)
                        .then(() => {
                            Tickets.remove(id)
                                .then(() => {
                                    res.status(200).json({ message: "Ticket was deleted!!." });
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ message: "Error deleting this ticket." })
                        })
                } else res.status(400).json({ message: "You may not delete the ticket it." })
            } else res.status(404).json({ message: "Ticket could not be found." })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Unable to remove...here was an error deleting the ticket ." });
        }) :
        res.status(400).json({ message: "Deleting tickets is restricted to students." })
})


module.exports = router;