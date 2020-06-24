const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session); 

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const ticketsRouter = require('../tickets/tickets-router.js');
const authenticate = require('../auth/authenticate-middleware.js');
const dbConnection = require("../data/dbConfig.js");

const server = express();

const sessionConfig = {
    name: "monster",
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    resave: false,
    saveUninitialized: process.env.SEND_COOKIES || true,
    cookie: {
        maxAge: 1000 * 60 * 60, // good for 1hr mins in ms
        secure: process.env.USE_SECURE_COOKIES || false, // used over https only, set to true in production
        httpOnly: true, // true means JS on the client cannot access the cooke
    },
    // the store property controls where the session is stored, by default it is in memory
    // we're changing it to use the database through Knex
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60, // will remove expired sessions every hour
    }),
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig));

server.use('/auth', authRouter);
server.use('/users', authenticate, usersRouter);
server.use('/tickets', authenticate, ticketsRouter);
server.get("/", (req, res) => {
    res.json({ api: "This DevDesk API is up and running" });
});

module.exports = server;