const mongoose = require('mongoose');
const {Trade} = require('../models/trade');
const {Portfolio} = require('../models/portfolio');

module.exports = {

	checkValidPortfolio: async function(id) {
		const portfolio = await Portfolio.findById(id);
		if ( !portfolio )
			return { valid: false};
		return {valid: true, obj: portfolio};
	},

	getTradesFromPortfolio: async function(portfolio) {
		return portfolio['trades'];
	}

}