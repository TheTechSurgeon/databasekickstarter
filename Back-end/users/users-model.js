const db = require("../data/dbConfig.js");
module.exports = {
    add,
    assignTicket,
    change,
    findBy,
    findById,
    findUser,
    findStudent,
    findAssignedTickets,
    findAssignedTicketById,
    findStdTicketById,
    remove,
    removeTicket,
    removeAsgTicket,
    setUserLogs


};

function change(user, id) {
    return db('users')
        .where({ id })
        .change(user);
}

async function setUserLogs(data) {
    if (data.userid && data.title && data.description) {
        const [logs] = await db('logs').insert(data);
        return ({ status: 201, msg: logs });
    } else {
        return ({ status: 418, msg: "Incomplete query data. Check that all fields are sent." })
    }
}

function add(user) {
    return db('users').insert(user, "id").then(ids => { const [id] = ids; return findById(id); }).catch(error => {
        return res.status(500).json({ message: 'failed to add new user' });
    });
}


function findBy(filter) {
    return db("users").where(filter);
}

function findUser() {
    return db('users').select('id', 'username', 'email', 'role');
}

function findById(id) {
    return db('users').select('id', 'username', 'role').where({ id }).first();
}

function findStudent(id) {
    return db('stud_tickets as st')
        .where('studentid', id)
        .join('tickets as t', 'st.ticketid', 't.id')
        .select('st.ticketid', 't.title', 't.description', 't.tried', 't.category', 'solution');
}
function findAssignedTickets(id) {
    return db('asg_tickets as at')
        .where('helperid', id)
        .join('tickets as t', 'at.ticketid', 't.id')
        .select(
            'at.ticketid',
            't.title',
            't.description',
            't.tried',
            't.category',
            'solution'
        );
}

async function findAssignedTicketById(ticketid) {
    return await db('asg_tickets')
        .select('id', 'helperid', 'ticketid')
        .where({ ticketid })
        .first();
}

async function assignTicket(helperid, ticketid) {
    return await db('asg_tickets')
        .insert({ helperid, ticketid }, 'id')
        .then(() => findAssignedTickets(helperid));
}

function remove(id) {
    return db('users')
        .where({ id: id })
        .del();
}

function removeAsgTicket(ticketid) {
    return db('asg_tickets')
        .where({ ticketid })
        .del();
}

async function removeTicket(ticketid) {
    return await db('stud_tickets')
        .where({ ticketid })
        .del();
}

function findStdTicketById(id) {
    return db('stud_tickets')
        .where({ id })
        .first();
}