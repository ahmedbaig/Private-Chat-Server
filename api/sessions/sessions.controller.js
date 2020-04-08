'use strict';

const ConnectionModel = require('../../models/connection.model');
const SessionModel = require('../../models/session.model');

function handleError(message){
  res.send({
    success: false,
    message
  })
}

exports.activeConnections = async function (req, res){
	try{
		let users = []
		ConnectionModel.find({room: req.query.room}, (err, connections)=>{
			connections.forEach(connection=>{
				SessionModel.findById(connection.user, (err, user)=>{
					users.push(user)
				})
			})
			res.send({
				success: true,
				users
			})
		})
	}catch(e){
		handleError(e.message)
	}
}