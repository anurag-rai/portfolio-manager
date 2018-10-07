const express = require('express');
const stocks = require('../routes/stocks');
const trades = require('../routes/trades');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/stocks', stocks);
  app.use('/api/trades', trades);
  app.use(error);
}