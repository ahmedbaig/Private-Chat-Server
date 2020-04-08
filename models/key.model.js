'use strict';
const mongoose = require('mongoose');

const makeKey = (length) => {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }
 
const KeySchema = new mongoose.Schema({
	authorization_token: {
		type:String,
		default: makeKey(50),
		unique: true
	},
	session_token: { // user ID
		type:String, 
		unique: true
	},
	access: {
		type:String,
		default: false	
	},
	write: {
		type:String,
		default: false
	},
	read: {
		type:String,
		default: false
	},
    createdt: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('Key', KeySchema);
