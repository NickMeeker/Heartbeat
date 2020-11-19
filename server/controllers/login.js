const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

const User = mongoose.model('User');
const router = express.Router();

const tokenSecret = config.token.secret;
const tokenExpiresInSeconds = config.token.expiresInSeconds;

router.post('/', async (req, res) => {
  try {
    const username = req.body.username;
    const user = await User.findOne({ username });

    if (user) {
      const password = req.body.password;
      const passwordMatches = await bcrypt.compare(password, user.password);

      if (passwordMatches) {

        const token = jwt.sign({ username: user.username }, tokenSecret, {
          expiresIn: tokenExpiresInSeconds
        });

        res.status(200).send({ success: true, message: 'login successful', token });
        return;
      }
    }

    res.status(401).send({ success: false, message: 'Invalid username/password' });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});

module.exports = router;