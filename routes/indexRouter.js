const express = require('express');
const router = express.Router();

const { getHash, compareHash } = require('../src/crypt');
const collection = require('../src/config');

router.get('/', async function (request, result) {
    let options = {};

    if (request.session.user) {
        options.username = request.session.user.username;
    }

    result.render('index', options);
});

router.get('/sign-up', function (request, result) {
    result.render('sign-up');
});

router.post('/sign-up', async function (request, result) {
    let data = {
        username: request.body['sign-up-username'],
        hash: await getHash(request.body['sign-up-password']),
    }

    if (await collection.findOne({ username: data.username })) {
        result.render('sign-up', { alerts: [{ content: 'Username already taken', type: 'error' }] })
        return;
    } else {
        const userData = await collection.insertMany(data);
        // request.session.userId = userData[0]._id;
        console.log(`User "${userData[0].username}" created`);
        request.flash('alerts', [{ content: 'Account created successfully', type: 'success' }])
        result.redirect('/log-in');
    }
});

router.get('/log-in', function (request, result) {
    result.render('log-in', { alerts: request.flash('alerts') });
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
    } else {
        result.render('log-in', { alerts: [{ content: 'Invalid username or password', type: 'error' }] })
        return;
    }

    result.redirect('/');
});

router.get('/log-out', async function (request, result) {
    try {
        await request.session.destroy();
    } catch (error) {
        console.error('Error logging out:', error);
    }
    result.redirect('/');
});

module.exports = router;