const mongoose = require('mongoose');
const {Trade} = require('../models/trade');
const {Portfolio} = require('../models/portfolio');

module.exports = {
	checkValidPortfolio: async function(id) {
		console.log("utils: id: ", id);
		const portfolio = await Portfolio.findById(id);
		console.log("utils: portfolio: ", portfolio);
		if ( !portfolio )
			return { valid: false};
		return {valid: true, obj: portfolio};
	},

	getTradesFromPortfolio: async function(portfolio) {
		return portfolio['trades'];
	}
}