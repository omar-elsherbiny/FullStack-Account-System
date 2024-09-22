require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');

['session_secret_key', 'mongo_url'].forEach(envVar => {
    if (!process.env[envVar]) {
        throw Error(`Missing enviroment variable: ${envVar}`);
    }
});

module.exports = session({
    name: 'mongoSession',
    secret: process.env.session_secret_key,
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.mongo_url
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
});