'use strict';

const ConnectionModel = require('../../models/connection.model');
const SessionModel = require('../../models/session.model');

function handleError(message){
  res.send({
    success: false,
    message
  })
}

exports.livechatMessages = async function (req, res){
	try{
		if(req.query.room!=null&&req.query.room!=undefined&&req.query.room!=""){
			id = new RegExp(["^", req.query.room, "$"].join(""), "i");
			let queryStr = { '$or': [ { to: id }, { from: id } ] }
			if(req.query.startFrom!=null&&req.query.startFrom!=undefined&&req.query.startFrom!=""){
				queryStr['streamTime'] = { '$gte': req.query.startFrom }
			}
			MessageModel.find(queryStr, (err, session)=>{
				var messagesSession = session;
			  }).sort({ createdt: 1 }).then(function (messagesSession) { 
				return { messages: messagesSession, success: true }
			  })
		}else{
			handleError("Room ID was not given")
		}
	}catch(e){
		handleError(e.message)
	}
}