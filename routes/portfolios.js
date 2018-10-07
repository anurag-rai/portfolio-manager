const validateObjectId = require('../middleware/validateObjectId');
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

const {Portfolio, validate} = require('../models/portfolio');
const {Stock} = require('../models/stock');
const {BasePortfolio} = require('../models/basePortfolio');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// get all portfolios for the user
router.get('/', async (req, res) => {
  const basePortfolios = await Portfolio.find().sort('name');
  res.send(basePortfolios);
});


// Add a new portfolio.
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
  
  console.log("Parent = ", parent);
  let name;
  if ( req.body.name ) {
    name = req.body.name;
  } else {
    name = await parent['name'];
  }
  console.log("name = " , name);
  portfolio = new Portfolio({
    name: name,
    stocks: parent['stocks'],
    parentPortfolio: req.body.parentPortfolio
  });
  portfolio = await portfolio.save();
  
  res.send(portfolio);
});


// //TODO: Add middleware [auth, validateObjectId]
// router.put('/:id', validateObjectId, async (req, res) => {
//   const { error } = validateBasePortfolioForPut(req.body); 
//   if (error) return res.status(400).send(error.details[0].message);

//   // TODO: Develop better logic than to check param and update.
//   let portfolio;
//   if ( req.body.stocks ) {
//     // check if the new stocks are valid
//     let valid = await areStocksValid(req.body.stocks)
//     // Stocks have to be valid
//     if ( !valid ) {
//       return res.status(400).send('The new portfolio does not have valid stocks');
//     }
//     portfolio = await Portfolio.findByIdAndUpdate(req.params.id, {stocks: req.body.stocks}, {
//       new: true
//     });
//   }
//   if ( req.body.name ) {
//     portfolio = await Portfolio.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
//       new: true
//     });
//   }
//   if (!portfolio) return res.status(404).send('The portfolio with the given ID was not found.');
  
//   res.send(portfolio);
// });

//TODO: Add middleware [auth, admin, validateObjectId]
// router.delete('/:id', validateObjectId, async (req, res) => {
//   const portfolio = await Portfolio.findByIdAndRemove(req.params.id);
//   if (!portfolio) return res.status(404).send('The portfolio with the given ID was not found.');
  
//   res.send(portfolio);
// });


//TODO: Add middleware validateObjectId
router.get('/:id', validateObjectId, async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if ( !portfolio ) return res.status(404).send('The portfolio with the given Name was not found.');
  
  res.send(portfolio);
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