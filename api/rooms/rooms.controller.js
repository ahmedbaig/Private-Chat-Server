'use strict';

const ConnectionModel = require('../../models/connection.model');
const SessionModel = require('../../models/session.model');
const RoomModel = require('../../models/room.model');
const _ = require('lodash');
exports.activeConnections = async function (req, res) {
	try {
		let users = []
		ConnectionModel.find({ room: req.query.room }, (err, connections) => {
			connections.forEach(connection => {
				SessionModel.findById(connection.user, (err, user) => {
					users.push(user)
				})
			})
			res.send({
				success: true,
				users
			})
		})
	} catch (e) {
		res.send({
			success: false,
			message: e.message
		})
	}
}

exports.createRoom = async function (req, res) {
	try {
		if (req.body.room.id == null) {
			// Create a new room 
			if (req.body.room.isStream == true) {
				req.body.room['stream.roomLeader'] = req.auth.session_token
				req.body.room['stream.status'] = req.body.room.isStream
			}
			RoomModel.create(req.body.room).then(newroom => {
				// Create Connection from user to socket
				ConnectionModel.create({
					user: req.auth.session_token,
					room: newroom._id,
					system: newroom.system
				}, (err, connection) => { })
				res.send({ user: req.user, room: newroom, success: true })
			})
		} else {
			RoomModel.findById(req.body.room.id, (err, existingroom) => {
				if (err) {
					return { message: err, success: false }
				} else if (existingroom == null) {
					return { message: "Room not found.", success: false }
				} else {
					res.send({ user: req.user, room: existingroom, success: true })
				}
			})
		}
	} catch (err) {
		res.send({ message: err.message, success: false })
	}
}


exports.removeRoom = async (req, res) => {
	try {
		RoomModel.findById(req.body.id, (err, existingroom) => {
			if (existingroom.isStream == true && existingroom.stream.roomLeader == req.auth.session_token) {
				RoomModel.findByIdAndUpdate(req.body.id, { 'stream.status': false }, (err, raw) => {
					// ConnectionModel.remove({ user: req.auth.session_token, room:req.body.id }, (err) => { })
					return res.send({ room: raw, success: true })
				})
			} else if (existingroom.isStream == false) {
				return res.send({ message: "Non-stream rooms cannot be destroyed.", success: false })
			} else {
				return res.send({ message: "Unauthorized Access! Cannot be destroyed.", success: false })
			}
		})
	} catch (err) {
		return res.send({ message: err.message, success: false })
	}
}

exports.getRooms = async (req, res) => {
	RoomModel.find({ isStream: true }, (err, rooms) => {
		return res.send({ rooms, success: true })
	});
}

exports.getRoom = async (req, res) => {
	RoomModel.findOne({ isStream: true, _id: req.query.id }, (err, room) => {
		ConnectionModel.find({room: req.query.id}, (err, connections)=>{
			let users = []
			Promise.all(_.map(connections, socket => {
				SessionModel.findById(socket.user, (err, user)=>{
					users.push(user)
				})
			})).then(()=>{
				_.delay(()=>{
					return res.send({ users, room, connections, success: true })
				}, 2000)
			})
		}) 
	});
}

exports.getUsersInRoom = async (req, res) => {  
	ConnectionModel.find({room: req.query.id}, (err, connections)=>{
		let users = []
		Promise.all(_.map(connections, socket => {
			SessionModel.findById(socket.user, (err, user)=>{
				users.push(user)
			})
		})).then(()=>{
			_.delay(()=>{
				return res.send({ users, success: true })
			}, 2000)
		}) 
	})
}
