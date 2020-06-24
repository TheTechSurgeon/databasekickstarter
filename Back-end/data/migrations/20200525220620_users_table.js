exports.up = function(knex) {
    return knex.schema
        .createTable('users', users => {
            users.increments();
            users.string('username', 128).notNullable().unique();
            users.string('password', 255).notNullable();
            users.string('email', 255).notNullable().unique();
            users.string("role", 128).notNullable();

        })
        .createTable('tickets', tickets => {
            tickets.increments();
            tickets.string('title', 128).notNullable();
            tickets.string('description', 800);
            tickets.string('tried', 800);
            tickets.string('category', 128);
            tickets.string('solution', 800);
            tickets.boolean('assigned').defaultTo(false);
            tickets.boolean('resolved').defaultTo(false);

        })

};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('tickets');

};