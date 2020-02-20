const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskScheme = new Schema({
	title: {
		type: String,
		required: true,
	},
	isFinished: {
		type: Boolean,
		required: false,
	}
});

module.exports = mongoose.model('Task', taskScheme, 'tasks');