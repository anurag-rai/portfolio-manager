const express = require('express');
const stocks = require('../routes/stocks');
const trades = require('../routes/trades');
const baseportfolio = require('../routes/basePortfolios');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/stocks', stocks);
  app.use('/api/trades', trades);
  app.use('/api/baseportfolio', baseportfolio);
  app.use(error);
}