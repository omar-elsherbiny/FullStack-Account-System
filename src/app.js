const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const hostname = process.env.hostname || 'localhost';
const port = process.env.port || 8080;

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
    result.redirect('/');
});

app.post('/log-in', async function (request, result) {
    let data = {
        username: request.body['log-in-username'],
        password: request.body['log-in-password']
    }
    result.redirect('/');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});