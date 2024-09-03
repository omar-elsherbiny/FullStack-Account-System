const express = require('express');
const router = express.Router();

router.get('/', async (request, result) => {
    let options = { alerts: request.flash('alerts') };

    if (request.session.user) {
        options.username = request.session.user.username;
    }

    result.render('index', options);
});

module.exports = router;