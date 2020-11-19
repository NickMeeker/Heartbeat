const express = require('express');
const tokenUtils = require('../auth/token_utils');
const mongoose = require('mongoose');
const Heartbeat = require('../models/Heartbeat');
const User = require('../models/User');

const router = express.Router();

router.post('/:username', tokenUtils.verifyToken, async (req, res) => {
  const sessionUsername = tokenUtils.getUsernameFromToken(req.headers['x-access-token']);
  const user = await User.findOne({ username: sessionUsername });

  if (!user || user.privilege !== 'admin') {
    res.status(403).send({
      success: false,
      message: `must be admin user`
    });
  }

  const username = req.params.username;
  const heartbeat = new Heartbeat({ username });
  try {
    await heartbeat.save();
    res.status(201).send({ success: true, message: `heartbeat created for ${username}` });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }

});

router.patch('/ping/:username', tokenUtils.verifyToken, (req, res) => {
  const sessionUsername = tokenUtils.getUsernameFromToken(req.headers['x-access-token']);
  const username = req.params.username;

  if (sessionUsername !== username) {
    res.status(403).send({
      success: false,
      message: `${username} does not match session username`
    });
  }


  if (username) {
    Heartbeat.findOneAndUpdate({ username }, {
      lastUpdated: Date.now()
    }, (err, heartbeat) => {
      if (heartbeat) {
        res.status(200).send({
          success: true,
          message: `${username} heartbeat updated to ${heartbeat.lastUpdated}`
        });
      } else {
        res.status(401).send({ success: false, message: 'Invalid username' });
      }
    });
  }
});

router.get('/:username', tokenUtils.verifyToken, async (req, res) => {
  const sessionUsername = tokenUtils.getUsernameFromToken(req.headers['x-access-token']);
  const user = await User.findOne({ username: sessionUsername });

  if (!user || user.privilege !== 'admin') {
    res.status(403).send({
      success: false,
      message: `must be admin user`
    });
  }

  const username = req.params.username;

  try {
    const heartbeat = await Heartbeat.findOne({ username });
    if (heartbeat) {
      res.status(200).send({
        success: true,
        message: `heartbeat found for ${username}, lastUpdated=${heartbeat.lastUpdated}`,
        heartbeat
      });
    } else {
      res.status(404).send({
        success: false,
        message: `no heartbeat found for ${username}`
      })
    }
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});
module.exports = router;