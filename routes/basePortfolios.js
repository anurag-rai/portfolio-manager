const validateObjectId = require('../middleware/validateObjectId');
const {BasePortfolio, validate, validateBasePortfolioForPut} = require('../models/basePortfolio');
const {Stock} = require('../models/stock');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const basePortfolios = await BasePortfolio.find().sort('name');
  res.send(basePortfolios);
});


// TODO: add auth middleware for authorization
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Name has to be unique
  let valid = await isValidName(req.body.name)
  if ( !valid ) {
    return res.status(400).send('The basePortfolio with the given Name already exists'); //TODO: 400 Bad Request?
  }
  valid = await areStocksValid(req.body.stocks)
  // Stocks have to be valid
  if ( !valid ) {
    return res.status(400).send('The basePortfolio does not have valid stocks');
  }

  basePortfolio = new BasePortfolio({
    name: req.body.name,
    stocks: req.body.stocks
  });
  basePortfolio = await basePortfolio.save();
  
  res.send(basePortfolio);
});


//TODO: Add middleware [auth, validateObjectId]
router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validateBasePortfolioForPut(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // TODO: Develop better logic than to check param and update.
  let basePortfolio;
  if ( req.body.stocks ) {
    // check if the new stocks are valid
    let valid = await areStocksValid(req.body.stocks)
    // Stocks have to be valid
    if ( !valid ) {
      return res.status(400).send('The new basePortfolio does not have valid stocks');
    }
    basePortfolio = await BasePortfolio.findByIdAndUpdate(req.params.id, {stocks: req.body.stocks}, {
      new: true
    });
  }
  if ( req.body.name ) {
    basePortfolio = await BasePortfolio.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
      new: true
    });
  }
  if (!basePortfolio) return res.status(404).send('The basePortfolio with the given ID was not found.');
  
  res.send(basePortfolio);
});

//TODO: Add middleware [auth, admin, validateObjectId]
router.delete('/:id', validateObjectId, async (req, res) => {
  const basePortfolio = await BasePortfolio.findByIdAndRemove(req.params.id);
  if (!basePortfolio) return res.status(404).send('The basePortfolio with the given ID was not found.');
  
  res.send(basePortfolio);
});


//TODO: Add middleware validateObjectId
router.get('/:id', validateObjectId, async (req, res) => {
  const basePortfolio = await BasePortfolio.findById(req.params.id);
  if (basePortfolio.length === 0) return res.status(404).send('The basePortfolio with the given Name was not found.');
  
  res.send(basePortfolio);
});


async function isValidName(name) {
    let basePortfolio = await BasePortfolio.find({name: name});
    if (basePortfolio.length !== 0) {
      return false;
    }
    return true;
}


async function areStocksValid(stocks) {
    console.log("Stocks: ", stocks);
    const l = stocks.length;
    var i;
    var valid;
    for(i = 0; i < l; i++ ) {
      valid = await isStockValid(stocks[i]);
      if ( !valid )
        return false;
    }
    return true;
}


async function isStockValid(stockName) {
    console.log("Stock: ", stockName);
    const stock = await Stock.find({name: stockName});
    console.log("Found: ", stock);
    if (stock.length === 0)
      return false;
    return true
}


module.exports = router;