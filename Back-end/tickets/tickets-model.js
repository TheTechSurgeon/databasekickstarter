const db = require('../data/dbConfig.js');
module.exports = {
    add,
    addToStudent,
    find,
    findBy,
    findById,
    getBy,
    remove,
    update,
    
};

async function add(ticket) {
    return await db('tickets')
        .insert(ticket, 'id')
        .then(([id]) => findById(id));
}

function addToStudent(studentid, ticketid) {
    return db('stud_tickets')
        .insert({ studentid, ticketid }, 'id')
        .then(() => findById(ticketid));
}

function find(filter) {
    return db('tickets').where(filter);
}

function findBy() {
    return db('tickets');
}

function findById(id) {
    return db('tickets')
        .select('id', 'title', 'description', 'solution')
        .where({ id })
        .first();
}

function getBy(data) {
    return db('tickets')
        .where({ data })
}

function remove(id) {
    return db('tickets')
        .where({ id })
        .del();
}

async function update(id, changes) {
    return await db('tickets')
        .where({ id }).update(changes).then(() => findById(id));
}