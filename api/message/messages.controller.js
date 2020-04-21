'use strict';

const MessageModel = require('../../models/message.model');
const SessionModel = require('../../models/session.model');
 
// IF isRoom is true, the FROM: room
// IF isRoom is false, the TO: room
exports.livechatMessages = async function (req, res){
	try{
		if(req.query.room!=null&&req.query.room!=undefined&&req.query.room!=""){ 

			let id = new RegExp(["^", req.query.room, "$"].join(""), "i");

			let queryStr = { '$or': [ { to: id }, { from: id } ] }

			if(req.query.startFrom!=null&&req.query.startFrom!=undefined&&req.query.startFrom!=""){
				queryStr['streamTime'] = { '$gte': req.query.startFrom }
			}
			console.log(queryStr)
			MessageModel.find(queryStr, (err, session)=>{
				var messagesSession = session;
			  }).sort({ createdt: 1 }).then(function (messagesSession) {  
				return res.send({ messages: messagesSession, success: true })
			  })
		}else{ 
			return res.send({ message: "Room ID was not given", success: true }) 
		}
	}catch(e){ 
		return res.send({ message: e.message, success: false })
	}
}

exports.insertLiveChatMessage = async function (req, res){
	try{
		req.body['name'] = req.user.name
		req.body['meta'] = req.user.meta
		if(req.auth.write == true){
			MessageModel.create(req.body, (err, message)=>{
				res.send({
					success: true,
					message
				})
			})
		}else{
		return res.send({ message: "Write authorization blocked. Contact Admin.", success: false }) 
		}
	}catch(e){
		return res.send({ message: e.message, success: false }) 
	}
}