const express = require('express');
const router = express.Router();

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/heartbeat', require('./heartbeat'));

module.exports = router;