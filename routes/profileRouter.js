const express = require('express');
const router = express.Router();

const { loginRequired } = require('../src/funcs');
const collection = require('../src/dbconfig');

router.get('/', loginRequired, (request, result) => {
    result.redirect('/profile/' + request.session.user.username);
});

router.get('/:username', async (request, result, next) => {
    const searched_user = await collection.findOne({ username: request.params.username });
    if (searched_user) {
        result.render('profile', {
            alerts: request.flash('alerts'),
            username: request.session.user.username,
            profileUsername: searched_user.username,
            profileDisplayName: searched_user.displayName,
            canEdit: request.session.user ? (request.session.user.username == request.params.username) : false,
            memberSince: (searched_user.memberSince).toLocaleDateString('en-GB'),
            showMemberSince: searched_user.showMemberSince,
        });
    } else {
        next();
    }
});

router.put('/:username/update-profile', loginRequired, async (request, result, next) => {
    if (request.session.user.username != request.params.username) {
        result.status(401).json({ message: 'Unauthorized to update profile' });
        return;
    }

    try {
        let data = request.body;

        const user = await collection.findOneAndUpdate({ _id: request.session.user.id }, data, { new: true });

        if (data.showMemberSince) {
            result.json({ message: 'Profile updated successfully', username: user.username, memberSince: user.memberSince.toLocaleDateString('en-GB') });
        } else {
            result.json({ message: 'Profile updated successfully', username: user.username });
        }
    } catch (error) {
        result.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

module.exports = router;