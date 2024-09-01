require('dotenv').config();
const express = require('express');

const { getHash, compareHash } = require('./crypt');
const collection = require('./config');
const session = require('./session');

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (request, result) {
    result.render('index');
});

app.get('/sign-up', function (request, result) {
    result.render('sign-up');
});

app.post('/sign-up', async function (request, result) {
    let data = {
        username: request.body['sign-up-username'],
        hash: await getHash(request.body['sign-up-password'])
    }

    if (await collection.findOne({ username: data.username })) {
        result.render('sign-up', { alerts: [{ content: 'Username already taken', type: 'error' }] })
        return;
    } else {
        const userData = await collection.insertMany(data);
        request.session.userId = userData._id;
        console.log(`user "${userData[0].username}" created`);
    }

    result.redirect('/');
});

app.get('/log-in', function (request, result) {
    result.render('log-in');
});

app.post('/log-in', async function (request, result) {
    let data = {
        username: request.body['log-in-username'],
        password: request.body['log-in-password']
    }

    const user_check = await collection.findOne({ username: data.username });

    if (user_check && await compareHash(data.password, user_check.hash)) {
        request.session.userId = user_check._id;
        console.log(`user "${data.username}" logged in`);
    } else {
        result.render('log-in', { alerts: [{ content: 'Invalid username or password', type: 'error' }] })
        return;
    }

    result.redirect('/');
});

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