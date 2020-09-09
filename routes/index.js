const express = require('express');

const app = express();

app.use(require('./projects'));
app.use(require('./sign'));
app.use(require('./tickets'));
app.use(require('./users'));

module.exports = app;