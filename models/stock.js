const Joi = require('joi');
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    unique: true
  },
  rate: {
    type: Number,
    required: true,
    min: 1
  }
});

const Stock = mongoose.model('Stock', stockSchema);

function validateStock(stock) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    rate: Joi.number().integer().min(1).required()
  };

  return Joi.validate(stock, schema);
}

function validateStockForPut(stock) {
  const schema = Joi.object().keys({
    name: Joi.string().min(1).max(50),
    rate: Joi.number().integer().min(1)
  }).or('name', 'rate');

  return Joi.validate(stock, schema);
}

exports.stockSchema = stockSchema;
exports.Stock = Stock; 
exports.validate = validateStock;
exports.validateStockForPut = validateStockForPut;