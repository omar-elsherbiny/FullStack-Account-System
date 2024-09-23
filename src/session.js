const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
    name: 'mongoSession',
    secret: process.env.SESSION_SECRET_KEY,
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
});