const express = require('express');
const router = express.Router();

const { loginRequired } = require('../src/funcs');

router.get('/', loginRequired, (request, result) => {
    result.send('Profile page')
});

module.exports = router;