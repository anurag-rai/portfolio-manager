const validateObjectId = require('../middleware/validateObjectId');
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

const {Trade, validate, validateTradeForPut} = require('../models/trade');
const {Stock} = require('../models/stock');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Get all trades
router.get('/', async (req, res) => {
  const trades = await Trade.find().sort('_id');
  res.send(trades.reverse());
});

// Add a new trade.
// TODO: add auth middleware for authorization
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //get rate of the stock
  const stock = await Stock.find({name: req.body.stock});
  if (stock.length === 0) return res.status(400).send('The stock with the given Name does not exist.');
  // console.log("Stock, ", stock);
  // console.log("First, ", stock[0]);
  trade = new Trade({
    stock: req.body.stock,
    quantity: req.body.quantity,
    action: req.body.action,
    rate: stock[0]['rate']   //TODO: Tight coupling. Change this. Myabe us a Stock API?
  });

  trade = await trade.save();
  
  res.send(trade);
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