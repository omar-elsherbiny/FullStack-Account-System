const express = require('express');
const router = express.Router();

router.get('/', function (request, result) {
    result.send('Profile page')
});

module.exports = router;