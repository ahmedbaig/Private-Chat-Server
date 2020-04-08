'use strict';
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	to: {
		type: String,
		required: true
	},
	from: {
		type: String,
		required: true
	},
	isRoom: {
		type: Boolean,
		default: false,
	},
	streamTime: {
		type: Number,
		default: 0
	}, 
	message: {
		type: String,
		required: true
	},
    createdt: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('Message', MessageSchema);
