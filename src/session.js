require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
    name: 'mongoSession',
    secret: process.env.session_secret_key || 'secret',
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/Account_System'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
});