const mongoose = require('mongoose');

const Heartbeat = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Heatbeat', Heartbeat);