const express = require('express');
const stocks = require('../routes/stocks');
const trades = require('../routes/trades');
const basePortfolios = require('../routes/basePortfolios');
const portfolios = require('../routes/portfolios');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/stocks', stocks);
  app.use('/api/trades', trades);
  app.use('/api/basePortfolios', basePortfolios);
  app.use('/api/portfolios', portfolios);
  app.use(error);
}