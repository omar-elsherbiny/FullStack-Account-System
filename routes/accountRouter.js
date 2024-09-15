const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fs = require('fs');

const { loginRequired } = require('../src/funcs');
const { getHash, compareHash } = require('../src/crypt');
const collection = require('../src/dbconfig');

router.get('/', loginRequired, (request, result) => {
    result.render('account', {
        alerts: request.flash('alerts'),
        username: request.session.user.username,
        displayName: request.session.user.displayName,
        pfpPath: request.session.user.pfpPath,
    });
});

router.get('/sign-up', (request, result) => {
    if (request.session.user) {
        request.flash('alerts', [{ content: 'You are already logged in', type: 'info' }]);
        result.redirect('/');
    } else {
        result.render('sign-up', { alerts: request.flash('alerts') });
    }
});

router.post(
    '/sign-up',
    body('sign-up-username').toLowerCase().trim().notEmpty().isLength({ min: 3, max: 25 }).matches(/^[A-Za-z\d_\-\.!#$%&]{3,25}$/).escape(),
    // body('sign-up-password').trim().notEmpty().isLength({ min: 8 }).matches(/^(?! )(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}(?<! )$/),
    async (request, result) => {
        let data = {
            username: request.body['sign-up-username'].toLowerCase(),
            hash: await getHash(request.body['sign-up-password']),
        }

        if (request.session.user) {
            request.flash('alerts', [{ content: 'You are already logged in', type: 'info' }]);
            result.redirect('/');
            return;
        }

        const validation = validationResult(request);

        if (!validation.isEmpty()) {
            result.render('sign-up', { alerts: [{ content: 'Invalid username or password', type: 'error' }] });
            return;
        }

        if (await collection.findOne({ username: data.username })) {
            result.render('sign-up', { alerts: [{ content: 'Username already taken', type: 'error' }] });
            return;
        }

        data.memberSince = Date.now();
        data.showMemberSince = true;

        const userData = await collection.insertMany(data);
        console.log(`User "${userData[0].username}" created`);
        request.flash('alerts', [{ content: 'Account created successfully', type: 'success' }]);
        result.redirect('/account/log-in');
    });

router.get('/log-in', (request, result) => {
    if (request.session.user) {
        request.flash('alerts', [{ content: 'You are already logged in', type: 'info' }]);
        result.redirect('/');
    } else {
        result.render('log-in', { alerts: request.flash('alerts') });
    }
});

router.post(
    '/log-in',
    body('log-in-username').toLowerCase().trim().notEmpty().escape(),
    body('log-in-password').trim().notEmpty(),
    async (request, result) => {
        let data = {
            username: request.body['log-in-username'].toLowerCase(),
            password: request.body['log-in-password'],
            keepLogged: request.body['log-in-stay'] == 'on' ? true : false,
        }

        const validation = validationResult(request);

        if (!validation.isEmpty()) {
            result.render('log-in', { alerts: [{ content: 'Invalid username or password', type: 'error' }] });
            return;
        }

        const user_check = await collection.findOne({ username: data.username });

        if (user_check && await compareHash(data.password, user_check.hash)) {
            request.session.user = {
                id: user_check._id,
                username: data.username,
                displayName: user_check.displayName,
                pfpPath: user_check.pfpPath ? '/uploads/' + user_check.pfpPath : '/media/profile-icon.png',
            };
            request.session.keepLogged = data.keepLogged;
            request.session.timestamp = Date.now();
            console.log(`User "${data.username}" logged in`);
            request.flash('alerts', [{ content: 'Logged in successfully', type: 'success' }]);
            result.redirect('/');
        } else {
            result.render('log-in', { alerts: [{ content: 'Invalid username or password', type: 'error' }] });
        }
    });

router.post('/log-out', (request, result) => {
    request.session.user = null;
    request.flash('alerts', [{ content: 'Logged out successfully', type: 'success' }]);
    result.redirect('/');
});

router.post('/delete-account', async (request, result) => {
    try {
        const prevUser = request.session.user;
        if (prevUser.pfpPath != '/media/profile-icon.png') {
            fs.unlink(`./public/uploads/pfp_${prevUser.id}.jpeg`, (err) => {
                if (err) {
                    console.error(`Error removing file: ${err}`);
                } else {
                    console.log(`File has been successfully removed.`);
                }
            });
        }
        collection.deleteOne({ _id: prevUser.id }).then((result) => {
            console.log(`User '${prevUser.username}' deleted`);
        });
        request.session.user = null;
        request.flash('alerts', [{ content: 'Deleted account successfully', type: 'caution' }]);
    } catch (error) {
        request.flash('alerts', [{ content: 'Error deleting account', type: 'error' }]);
    }
    result.redirect('/');
});

router.post(
    '/update-username',
    body('username-edit-field').toLowerCase().trim().notEmpty().isLength({ min: 3, max: 25 }).matches(/^[A-Za-z\d_\-\.!#$%&]{3,25}$/).escape(),
    body('username-password-confirm-field').trim().notEmpty(),
    async (request, result) => {
        request.flash('alerts', [{ content: 'Updated username successfully', type: 'success' }]);
        // request.flash('alerts', [{ content: 'Invalid username or password', type: 'error' }]);
        result.redirect('/account');
    });

router.post(
    '/update-password',
    body('password-current-field').trim().notEmpty(),
    body('password-new-field').trim().notEmpty().isLength({ min: 8 }).matches(/^(?! )(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}(?<! )$/),
    body('password-confirm-field').trim().notEmpty().isLength({ min: 8 }).matches(/^(?! )(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}(?<! )$/),
    async (request, result) => {
        request.flash('alerts', [{ content: 'Updated password successfully', type: 'success' }]);
        result.redirect('/account');
    });

module.exports = router;