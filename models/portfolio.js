const Joi = require('joi');
const mongoose = require('mongoose');
const {tradeSchema} = require('./trade');


const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  trades: { 
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  stocks: { 
    type: [String],
  },
  parentPortfolio: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
  }
}));

function validatePortfolio(movie) {
  const schema = {
    name: Joi.string().min(1).max(50),
    parentPortfolio: Joi.objectId().required()
  };

  return Joi.validate(movie, schema);
}

exports.Portfolio = Portfolio; 
exports.validate = validatePortfolio;