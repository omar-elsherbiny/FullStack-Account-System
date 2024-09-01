const express = require('express');
const bcrypt = require('bcrypt');
const collection = require('./config');
require('dotenv').config();

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

async function getHash(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function compareHash(unHashedPassword, storedHash) {
    const match = await bcrypt.compare(unHashedPassword, storedHash);
    return match;
}

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
        result.render('log-in', { alerts: [{ content: 'Username already taken', type: 'error' }] })
        return;
    } else {
        const userData = await collection.insertMany(data);
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

    const check = await collection.findOne({ username: data.username });

    if (check && await compareHash(data.password, check.hash)) {
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