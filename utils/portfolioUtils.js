const mongoose = require('mongoose');
const {Trade} = require('../models/trade');
const {Portfolio} = require('../models/portfolio');

module.exports = {
	
	getHoldings: async function(portfolio) {

		var res = await portfolio['trades'].reduce(async function (accumulatorP, tradeId) {
			const accumulator = await accumulatorP;
			const trade = await Trade.findById(tradeId);
			const stock = trade['stock'];
			const rate = trade['rate'];
			const quantity = trade['quantity'];
			const action = trade['action'];
			if ( stock in accumulator) {
				let newN;
				let newQuantity;
				let newABP;
				if ( action === 'BUY' ) {
					newN = accumulator[stock]['n'] + 1;
					newQuantity = accumulator[stock]['quantity'] + quantity;
					newABP = accumulator[stock]['ABP'] + rate;
				} else {
					newN = accumulator[stock]['n'];
					newQuantity = accumulator[stock]['quantity'] - quantity;
					newABP = accumulator[stock]['ABP'];
				}
				accumulator[stock] = {
					stock: stock,
					n: newN,
					quantity: newQuantity,
					ABP: newABP
				};
			} else {
				accumulator[stock] = {
					stock: stock,
					n: 1,
					quantity: quantity,
					ABP: rate
				}
			}
			return accumulator;
		}, {});

		let result = {};
		for ( var key in res ) {
			if (!res.hasOwnProperty(key)) continue;
			var value = res[key];
			var stock = value['stock'];
			var n = value['n'];
			var averageQuantity = value['quantity'];
			var averageBP = value['ABP'] / n;
			result[stock] = {
				averageQuantity: averageQuantity,
				averageBP: averageBP
			}
		}

		return result;
	}
	
}