const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.json');

const port = config.server.port;
const app = express();

// mongoose config
mongoose.connect('mongodb://localhost/heartbeat', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('debug', true);

// app config
app.use(bodyParser.urlencoded({ extended: false }));

// models
require('./models');

// routes
app.use(require('./controllers'));

app.listen(port);
console.log(`Server started on port ${port}`);