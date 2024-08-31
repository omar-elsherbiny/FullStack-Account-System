const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const hostname = process.env.hostname || 'localhost';
const port = process.env.port || 8080;
let databose = {}

// live reload
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
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

app.post('/sign-up', async function (request, result) {
    let data = {
        username: request.body['sign-up-username'],
        password: request.body['sign-up-password']
    }
    if (data.username in databose) {
        console.log('nuh uh, username taken');
    } else {
        databose[data.username] = await getHash(data.password);
        console.log('nice bel ice, created new account');
    }
    console.log(databose);
    result.redirect('/');
});

app.post('/log-in', async function (request, result) {
    let data = {
        username: request.body['log-in-username'],
        password: request.body['log-in-password']
    }
    if (data.username in databose && await compareHash(data.password, databose[data.username])) {
        console.log('yuh uh, logged in');
    } else {
        console.log('nuh uh, invalid username or password');
    }
    result.redirect('/');
});

// app.get('/test', function (request, result) {
//     result.send('test');
// });

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