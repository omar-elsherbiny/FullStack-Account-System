// enviroment variables
require('dotenv').config();
const hostname = process.env.hostname = process.env.hostname || 'localhost';
const port = process.env.port = process.env.port || 8080;
const nodeEnv = process.env.node_env = process.env.node_env || 'production';
['session_secret_key', 'mongo_url'].forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Missing enviroment variable: ${envVar}`);
    }
});

// library imports
const express = require('express');
const flash = require('express-flash');

// js imports
const session = require('./session');
const { authUser, loginRequired } = require('./funcs');

// route imports
const indexRouter = require('../routes/indexRouter');
const accountRouter = require('../routes/accountRouter');
const profileRouter = require('../routes/profileRouter');

const app = express();

// live reload
if (nodeEnv == 'development') {
    const livereload = require('livereload');
    const connectLiveReload = require('connect-livereload');
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once('connection', () => {
        setTimeout(() => {
            liveReloadServer.refresh('/');
        }, 100);
    });
    app.use(connectLiveReload());
}
// live reload //

// main middleware
app.use(session);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// login authorize middleware
app.use(authUser);

// routes
app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/profile', profileRouter);

// 404
app.use((request, result, next) => {
    result.status(404);

    if (request.accepts('html')) {
        result.render('error', { errorCode: 404, errorMessage: 'Page not found' });
        return;
    }

    if (request.accepts('json')) {
        result.json({ error: 'Not found' });
        return;
    }

    result.type('txt').send('Not found');
});

app.listen(port, hostname, () => {
    console.log(`Server running on ${nodeEnv} enviroment at http://${hostname}:${port}/`);
});