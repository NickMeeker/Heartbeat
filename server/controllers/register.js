const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.body);

  const username = req.body.username;
  const privilege = req.body.privilege;

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username,
    password,
    privilege
  });

  try {
    await user.save();
    res.status(201).send({ success: true, message: 'user created' });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});

module.exports = router;