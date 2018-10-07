const validateObjectId = require('../middleware/validateObjectId');
// const auth = require('../middleware/auth');

const {Trade, validate, validateTradeForPut} = require('../models/trade');
const {Stock} = require('../models/stock');
const tradeUtils = require('../utils/tradeUtils');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

// Get all trades
// TODO: add auth middleware for authorization
router.get('/:portfolioId', async (req, res) => {
  //check if the portfolioId is valid
  const portfolio = await tradeUtils.checkValidPortfolio(req.params.portfolioId);
  if ( portfolio['valid'] === false )
    return res.status(400).send('The portfolio is not valid');
  
  console.log("portfolio: ", portfolio);
  //get trades from the portfolio
  const tradesList = await tradeUtils.getTradesFromPortfolio(portfolio['obj']);
  console.log("TradesList: ", tradesList);
  
  const trades = await Trade.find({ '_id' : {$in: tradesList}});
  console.log("Trades: ", trades);
  res.send(trades);
});


// Add a new trade.
// TODO: add auth middleware for authorization
router.post('/:portfolioId', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //check if the portfolioId is valid
  const portfolio = await tradeUtils.checkValidPortfolio(req.params.portfolioId);
  if ( !portfolio['valid]'] === false )
    return res.status(400).send('The portfolio is not valid');

  //check if stock in portfolio
  if ( portfolio['obj']['stocks'].indexOf(req.body.stock) < 0 )
    return res.status(400).send('The stock is not valid in this portfolio');
  
  //get rate of the stock
  const stock = await Stock.find({name: req.body.stock});
  if (stock.length === 0) return res.status(400).send('The stock with the given Name does not exist.');

  const trade = new Trade({
    stock: req.body.stock,
    quantity: req.body.quantity,
    action: req.body.action,
    rate: stock[0]['rate']   //TODO: Tight coupling. Change this. Myabe us a Stock API?
  });

  // Need atomicity to save both Trade and to Portfolio
  try {
    new Fawn.Task()
      .save('trades', trade)
      .update('portfolios', { _id: req.params.portfolioId }, { 
        $addToSet: { trades: {$ojFuture: "0._id"} }
      })
      .run({useMongoose: true});
  
    res.send(trade);
  }
  catch(ex) {
    throw new Error(ex.message);
    res.status(500).send('Something failed while updating trade');
  }
});


//TODO: Add middleware auth
router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validateTradeForPut(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // TODO: Develop better logic than to check param and update.
  let trade;
  if ( req.body.stock ) {
    // check if the new stock exists
    const stock = await Stock.find({name: req.body.stock});
    if ( stock.length === 0)  return res.status(400).send('The stock with the given Name does not exist.'); 
    trade = await Trade.findByIdAndUpdate(req.params.id, {stock: req.body.stock}, {
      new: true
    });
  }
  if ( req.body.quantity ) {
    trade = await Trade.findByIdAndUpdate(req.params.id, {quantity: req.body.quantity}, {
      new: true
    });
  }
  if ( req.body.action ) {
    trade = await Trade.findByIdAndUpdate(req.params.id, {action: req.body.action}, {
      new: true
    });
  }
  if (!trade) return res.status(404).send('The trade with the given ID was not found.');
  
  res.send(trade);
});

//TODO: Add middleware auth
router.delete('/:id', validateObjectId, async (req, res) => {
  const trade = await Trade.findByIdAndRemove(req.params.id);
  if (!trade) return res.status(404).send('The trade with the given ID was not found.');
  
  res.send(trade);
});


router.get('/:id', validateObjectId, async (req, res) => {
  const trade = await Trade.findById(req.params.id);
  if (trade.length === 0) return res.status(404).send('The trade with the given Name was not found.');
  
  res.send(trade);
});

module.exports = router;