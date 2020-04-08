'use strict';
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
	users: [ // socket IDs
		String
	],
	roomName: {
		type: String,
		required: true
	},
	system: {
		type: String,
		required: true,
		enum: ['sply', 'lyve']
	},
	stream: {
		id: String,
		roomLeader: {
			type: String
		},
		status: {
			type: Boolean,
			default: false
		},
	},
	isStream: {
		type: Boolean,
		default: false
	},
	meta: String,
    createdt: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('Room', RoomSchema);
