require('dotenv').config();
const express = require('express');
const flash = require('express-flash');

const session = require('./session');

const indexRouter = require('../routes/indexRouter');

const app = express();
const hostname = process.env.hostname || 'localhost';
const port = process.env.port || 8080;

// live reload
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
app.use(connectLiveReload());
// live reload //

app.use(session);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use((request, result, next) => {
    console.log(request.session);
    const now = Date.now();
    if (!request.session.keepLogged &&
        now - request.session.timestamp > 1000 * 60 * 60 * 3) { // 3 hours
        request.session.user = null;
    }
    request.session.timestamp = now;
    next();
});

app.use('/', indexRouter);

app.use((request, result, next) => {
    result.status(404);

    if (request.accepts('html')) {
        result.render('404');
        return;
    }

    if (request.accepts('json')) {
        result.json({ error: 'Not found' });
        return;
    }

    result.type('txt').send('Not found');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});