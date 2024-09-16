const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const cron = require('node-cron');

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

router.post('/sign-up',
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

router.post('/log-in',
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
        await collection.findOneAndUpdate(
            { _id: request.session.user.id },
            { suspendedFrom: new Date() }
        );
        request.session.user = null;
        request.flash('alerts', [{ content: 'Deleted account successfully', type: 'caution' }]);
    } catch (error) {
        request.flash('alerts', [{ content: 'Error deleting account', type: 'error' }]);
    }
    result.redirect('/');
});

router.post('/update-username',
    body('username-edit-field').toLowerCase().trim().notEmpty().isLength({ min: 3, max: 25 }).matches(/^[A-Za-z\d_\-\.!#$%&]{3,25}$/).escape(),
    body('username-password-confirm-field').trim().notEmpty(),
    async (request, result) => {
        let data = {
            username: request.body['username-edit-field'].toLowerCase(),
            password: request.body['username-password-confirm-field'],
        }

        const validation = validationResult(request);

        if (!validation.isEmpty()) {
            request.flash('alerts', [{ content: 'Invalid username or password', type: 'error' }]);
            result.redirect('/account?modal=0');
            return;
        }

        const user_check = await collection.findOne({ _id: request.session.user.id });

        if (!(user_check && await compareHash(data.password, user_check.hash))) {
            request.flash('alerts', [{ content: 'Incorrect password', type: 'error' }]);
            result.redirect('/account?modal=0');
            return;
        }

        if (data.username === request.session.user.username) {
            request.flash('alerts', [{ content: 'This is already your username', type: 'info' }]);
            result.redirect('/account?modal=0');
            return;
        }

        if (await collection.findOne({ username: data.username })) {
            request.flash('alerts', [{ content: 'Username already taken', type: 'error' }]);
            result.redirect('/account?modal=0');
            return;
        }

        request.session.user.username = data.username;
        await collection.findOneAndUpdate(
            { _id: request.session.user.id },
            { username: data.username }
        );

        request.flash('alerts', [{ content: 'Updated username successfully', type: 'success' }]);
        result.redirect('/account');
    });

router.post('/update-password',
    body('password-current-field').trim().notEmpty(),
    body('password-new-field').trim().notEmpty().isLength({ min: 8 }).matches(/^(?! )(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}(?<! )$/),
    body('password-confirm-field').trim().notEmpty().isLength({ min: 8 }).matches(/^(?! )(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}(?<! )$/),
    async (request, result) => {
        let data = {
            currentPassword: request.body['password-current-field'],
            newPassword: request.body['password-new-field'],
            confirmPassword: request.body['password-confirm-field'],
        }

        const validation = validationResult(request);

        if (!validation.isEmpty()) {
            request.flash('alerts', [{ content: 'Invalid password', type: 'error' }]);
            result.redirect('/account?modal=1');
            return;
        }

        const user_check = await collection.findOne({ _id: request.session.user.id });

        if (!(user_check && await compareHash(data.currentPassword, user_check.hash))) {
            request.flash('alerts', [{ content: 'Incorrect current password', type: 'error' }]);
            result.redirect('/account?modal=1');
            return;
        }

        if (data.currentPassword === data.newPassword) {
            request.flash('alerts', [{ content: 'New password must differ from the old one', type: 'error' }]);
            result.redirect('/account?modal=1');
            return;
        }

        if (data.newPassword !== data.confirmPassword) {
            request.flash('alerts', [{ content: 'Passwords do not match', type: 'error' }]);
            result.redirect('/account?modal=1');
            return;
        }

        await collection.findOneAndUpdate(
            { _id: request.session.user.id },
            { hash: await getHash(data.newPassword) }
        );

        request.flash('alerts', [{ content: 'Updated password successfully', type: 'success' }]);
        result.redirect('/account');
    });

cron.schedule('0 1 * * *', async () => {
    try {
        const usersToDelete = await collection.find({
            suspendedFrom: { $lte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } // 14 days
        });
        usersToDelete.forEach(user => {
            if (user.pfpPath) {
                fs.unlink(`./public/uploads/${user.pfpPath}`, (err) => {
                    if (err) {
                        console.error(`Error removing file: ${err}`);
                    } else {
                        console.log(`File has been successfully removed.`);
                    }
                });
            }
            collection.deleteOne({ _id: user.id }).then((result) => {
                console.log(`User '${user.username}' deleted`);
            });
        });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;