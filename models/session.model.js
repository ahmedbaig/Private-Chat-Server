'use strict';
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	platform: {
		type: String,
		required: true,
		enum: ['sply', 'lyve']
	},
	role: {
		type: String,
		required: true,
		enum: ['user', 'admin', 'marketing', 'provider']
	}, 
    createdt: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('Session', SessionSchema);
