const SessionModel = require('../models/session.model');
const RoomModel = require('../models/room.model');
const ConnectionModel = require('../models/connection.model');
const KeyModel = require('../models/key.model');
const MessageModel = require('../models/message.model');

const addMessage = ({ id, authorization_token, message }) => {
  KeyModel.findOne({authorization_token}, (err, key)=>{
    if(err){
      return { error: err, success: false }
    }else if(key == null){
      return { error: "Unauthorized Access!", success: false }
    }else{ 
      RoomModel.findById(id, (err, room)=>{
        if(room.isStream == true && room.stream.status == true){
          // It's a live chat
          MessageModel.create({
            to: id,
            from: key.session_token,
            isRoom: true,
            streamTime: message.streamTime, 
            message: message.message
          }, (new_message)=>{
            return { message, success: true }
          })
        }else{
          room.users.forEach(socket=>{
            ConnectionModel.findOne({socket}, (err, connection)=>{
              MessageModel.create({
                to: connection.session_token,
                from: key.session_token,
                isRoom: false, 
                message: message.message
              }, (new_message)=>{ 
              })
            })
          })  
          return { message, success: true }
        }
      })
    }
  })
}

const getMessages = ({ id }) => {
  // Where id is the room id and this part will only work for room messages
  MessageModel.find({ $or: [ { to: id }, { from: id } ] }, (err, session)=>{
    var messagesSession = session;
  }).sort({ createdt: 1 }).then(function (messagesSession) { 
    return { messages: messagesSession, success: true }
  })
}


module.exports = { addMessage, getMessages };