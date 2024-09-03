const express = require('express');
const router = express.Router();

router.get('/', async function (request, result) {
    let options = { alerts: request.flash('alerts') };

    if (request.session.user) {
        options.username = request.session.user.username;
    }

    result.render('index', options);
});

module.exports = router;