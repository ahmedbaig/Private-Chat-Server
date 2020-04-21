'use strict';
const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
	user: { // session_token
		type: String,
		required: true
	},
	room: {
		type: String,
		required: true
	},
	system: { 
		type: String,
		required: true,
		enum: ['sply', 'lyve']
	},
    createdt: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('Connection', ConnectionSchema);
