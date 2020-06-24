const express = require('express');
const Tickets = require('./tickets-model.js');
const router = express.Router();

// @route GET /tickets/
// @desc get all tickets 
// @access Private
// helper can see them all *****
//localhost: 4000 / tickets / open
// student can see their own ***
router.get('/', (req, res) => {
    Tickets.findBy()
        .then(tickets => {
            res.json(tickets)
        })
        .catch(err => {
            res.json(err)
        })
});

// @route GET /tickets/open
// @desc get OPEN tickets not assigned
// @access Private
router.get('/open', (req, res) => {
    Tickets.find({ assigned: false })
        .then(tickets => {
            res.status(200).json(tickets)
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

// @route GET api/tickets/closed
// @desc get OPEN tickets not resolved
// @access Private
router.get('/closed', (req, res) => {
    Tickets.find({ resolved: true })
        .then(tickets => {
            res.status(200).json(tickets)
        })
        .catch(err => {
            res.status(500).json(err)
        });
})


// @route PUT api/tickets/newticket
// @desc POST new ticket as a student
// @access Private
//localhost:4000/tickets
router.post('/', (req, res) => {
    const { title, description, tried, category } = req.body;
    if (req.user.role === 'student') {
        if (!title || !description || !tried || !category) {
            res.status(400).json({ message: "Something is missing!!!" });
        } else Tickets.add(req.body)
            .then(ticket => {
                Tickets.addToStudent(req.user.id, ticket.id)
                    .then(ticket => {
                        res.status(201).json(ticket);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Unable to add this ticket!!!" })
            })
    } else res.status(400).json({ message: "Only students can do this feature!!!" })
});


// @route GET api/tickets/:id/
// @desc get tickets by id 
// @access Private
//localhost:4000/tickets/1
router.get('/:id', (req, res) => {
    Tickets.findById(req.params.id)
        .then(tickets => {
            if (tickets) {
                res.json({
                    msg: "Ticket was found!!",
                    tickets
                })
            } else {
                res.status(404).json({ message: "The ticket with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Could not get ticket", err })
        })
})

// DELETE A TICKET
// @route DELETE /tickets/:id
// @desc delete ticket by :id
// @access Private
//localhost:4000/tickets/1
router.delete('/:id', (req, res) => {
    Tickets.remove(req.params.id)
        .then(tickets => {
            if (tickets) {
                res.json({ message: "Ticket removed!!!" })
            } else {
                res.status(404).json({ message: "Ticket with specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Ticket could not be removed", err })
        })
})

module.exports = router;