const express = require('express');
const router = express.Router();

const { getHash, compareHash } = require('../src/crypt');
const collection = require('../src/config');

router.get('/', function (request, result) {
    if (request.session.user) {
        result.send('account change page');
    } else {
        result.redirect('/account/log-in');
    }
});

router.get('/sign-up', function (request, result) {
    if (request.session.user) {
        request.flash('alerts', [{ content: 'You are already logged in', type: 'info' }]);
        result.redirect('/');
    } else {
        result.render('sign-up', { alerts: request.flash('alerts') });
    }
});

router.post('/sign-up', async function (request, result) {
    let data = {
        username: request.body['sign-up-username'],
        hash: await getHash(request.body['sign-up-password']),
    }

    if (await collection.findOne({ username: data.username })) {
        result.render('sign-up', { alerts: [{ content: 'Username already taken', type: 'error' }] })
    } else {
        const userData = await collection.insertMany(data);
        console.log(`User "${userData[0].username}" created`);
        request.flash('alerts', [{ content: 'Account created successfully', type: 'success' }])
        result.redirect('/account/log-in');
    }
});

router.get('/log-in', function (request, result) {
    if (request.session.user) {
        request.flash('alerts', [{ content: 'You are already logged in', type: 'info' }]);
        result.redirect('/');
    } else {
        result.render('log-in', { alerts: request.flash('alerts') });
    }
});

router.post('/log-in', async function (request, result) {
    let data = {
        username: request.body['log-in-username'],
        password: request.body['log-in-password'],
        keepLogged: request.body['log-in-stay'] == 'on' ? true : false,
    }

    const user_check = await collection.findOne({ username: data.username });

    if (user_check && await compareHash(data.password, user_check.hash)) {
        request.session.user = { id: user_check._id, username: data.username };
        request.session.keepLogged = data.keepLogged;
        request.session.timestamp = Date.now();
        console.log(`User "${data.username}" logged in`);
        request.flash('alerts', [{ content: 'Logged in successfully', type: 'success' }]);
        result.redirect('/');
    } else {
        result.render('log-in', { alerts: [{ content: 'Invalid username or password', type: 'error' }] })
    }
});

router.get('/log-out', async function (request, result) { // convert to post
    request.session.user = null;
    request.flash('alerts', [{ content: 'Logged out successfully', type: 'success' }]);
    result.redirect('/');
});

module.exports = router;