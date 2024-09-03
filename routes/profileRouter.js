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
            username: request.params.username,
        });
    } else {
        next();
    }
});

module.exports = router;