// const validateObjectId = require('../middleware/validateObjectId');
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

const {Stock, validate, validateStockForPut} = require('../models/stock');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Get all stocks
router.get('/', async (req, res) => {
  const stocks = await Stock.find().sort('name');
  res.send(stocks);
});

// Add a new stock.
// TODO: add auth middleware for authorization
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let stock = await Stock.find({name: req.body.name});
  if (stock.length !== 0) {
    return res.status(400).send('The stock with the given Name already exists'); //TODO: 400 Bad Request?
  }

  stock = new Stock({
    name: req.body.name,
    rate: req.body.rate
  });
  stock = await stock.save();
  
  res.send(stock);
});


//TODO: Add middleware [auth, validateObjectId]
router.put('/:name', async (req, res) => {
  const { error } = validateStockForPut(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // TODO: Develop better logic than to check param and update.
  let stock;
  if ( req.body.rate ) {
    stock = await Stock.findOneAndUpdate({ name: req.params.name }, {rate: req.body.rate}, {
      new: true
    });
  }
  if ( req.body.name ) {
    stock = await Stock.findOneAndUpdate({ name: req.params.name }, {name: req.body.name}, {
      new: true
    });
  }
  if (!stock) return res.status(404).send('The stock with the given ID was not found.');
  
  res.send(stock);
});

//TODO: Add middleware [auth, admin, validateObjectId]
router.delete('/:name', async (req, res) => {
  const stock = await Stock.findOneAndDelete({name: req.params.name});
  if (!stock) return res.status(404).send('The stock with the given Name was not found.');

  res.send(stock);
});


//TODO: Add middleware validateObjectId
router.get('/:name', async (req, res) => {
  const stock = await Stock.find({name: req.params.name});
  if (stock.length === 0) return res.status(404).send('The stock with the given Name was not found.');
  
  res.send(stock);
});

module.exports = router;