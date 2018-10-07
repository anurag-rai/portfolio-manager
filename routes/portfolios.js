const validateObjectId = require('../middleware/validateObjectId');
const {Portfolio, validate} = require('../models/portfolio');
const {Stock} = require('../models/stock');
const {BasePortfolio} = require('../models/basePortfolio');
const portfolioUtils = require('../utils/portfolioUtils');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// TODO: add auth middleware for authorization
router.get('/', async (req, res) => {
  const basePortfolios = await Portfolio.find().sort('name');
  res.send(basePortfolios);
});


// TODO: add auth middleware for authorization
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Name has to be unique
  let valid = await isParentValid(req.body.parentPortfolio)
  if ( !valid ) {
    return res.status(400).send('The base-portfolio does not exist'); //TODO: 400 Bad Request?
  }
  const parent = await getParentBasePortfolio(req.body.parentPortfolio);
  
  let name;
  if ( req.body.name ) {
    name = req.body.name;
  } else {
    name = await parent['name'];
  }
  portfolio = new Portfolio({
    name: name,
    stocks: parent['stocks'],
    parentPortfolio: req.body.parentPortfolio
  });
  portfolio = await portfolio.save();
  
  res.send(portfolio);
});


//TODO: Add middleware [auth, validateObjectId]
router.put('/:id', validateObjectId, async (req, res) => {
  res.status(500).send('Currently not supported');
});


// TODO: Add middleware [auth]
router.delete('/:id', validateObjectId, async (req, res) => {
  const portfolio = await Portfolio.findByIdAndRemove(req.params.id);
  if (!portfolio) return res.status(404).send('The portfolio with the given ID was not found.');
  
  res.send(portfolio);
});


router.get('/:id', validateObjectId, async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if ( !portfolio ) return res.status(404).send('The portfolio with the given ID was not found.');
  
  res.send(portfolio);
});


router.get('/:id/holdings/', validateObjectId, async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if ( !portfolio ) return res.status(404).send('The portfolio with the given ID was not found.');
  
  const holdings = await portfolioUtils.getHoldings(portfolio);
  res.send(holdings);
});


router.get('/:id/returns', validateObjectId, async (req, res) => {
  return res.status(500).send('Not implemented');
});


async function isParentValid(id) {
    let basePortfolio = await BasePortfolio.findById(id);
    console.log("Base portfolio: ", basePortfolio)
    if (!basePortfolio) {
      return false;
    }
    return true;
}


async function getParentBasePortfolio(id) {
  let basePortfolio = await BasePortfolio.findById(id);
  return basePortfolio;
}


module.exports = router;