const Joi = require('joi');
const mongoose = require('mongoose');
const {stockSchema} = require('./stock');


const tradeSchema = new mongoose.Schema({
  stock: { 
    type: String,  
    required: true
  },
  quantity: {
    type: Number, 
    required: true,
    min: 1
  },
  rate: {
    type: Number, 
    required: true,
  },
  action: {
    type: String,
    enum: ['BUY','SELL'],
    required: true
  },
  updatetime: {
    type: Date, 
    default: Date.now
  }
});


const Trade = mongoose.model('Trade', tradeSchema);


function validateTrade(trade) {
  const schema = {
    stock: Joi.string().min(1).max(50).required(),
    quantity: Joi.number().integer().min(1).required(),
    action: Joi.string().valid(['BUY','SELL']).required()
  };
  return Joi.validate(trade, schema);
}


function validateTradeForPut(trade) {
  const schema = Joi.object().keys({
    stock: Joi.string().min(1).max(50),
    quantity: Joi.number().integer().min(1),
    action: Joi.string().valid(['BUY','SELL'])
  }).or('stock', 'quantity', 'action');
  return Joi.validate(trade, schema);
}


exports.tradeSchema = tradeSchema;
exports.Trade = Trade; 
exports.validate = validateTrade;
exports.validateTradeForPut = validateTradeForPut;