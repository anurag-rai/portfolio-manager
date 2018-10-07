const Joi = require('joi');
const mongoose = require('mongoose');


const BasePortfolio = mongoose.model('BasePortfolio', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  stocks: { 
    type: [String],  
    required: true
  },
}));


function validateBasePortfolio(basePortfolio) {
  const schema = {
    name: Joi.string().trim().min(5).max(255).required(),
    stocks: Joi.array().items(Joi.string()).min(1).unique().required()
  };

  return Joi.validate(basePortfolio, schema);
}


function validateBasePortfolioForPut(basePortfolio) {
  const schema = Joi.object().keys({
    name: Joi.string().trim().min(5).max(255),
    stocks: Joi.array().items(Joi.string()).min(1).unique()
  }).or('name','stocks');

  return Joi.validate(basePortfolio, schema);
}


exports.BasePortfolio = BasePortfolio; 
exports.validate = validateBasePortfolio;
exports.validateBasePortfolioForPut = validateBasePortfolioForPut;