const RoomModel = require('../models/room.model');
const KeyModel = require('../models/key.model');
const ConnectionModel = require('../models/connection.model');
const SessionModel = require('../models/session.model');

const addRoom = ({ authorization_token, room, socket }) => { 
  try{   
    KeyModel.findOne({authorization_token}, (err, key)=>{
      if(err){
        return { error: err, success: false }
      }else if(key == null){
        return { error: "Unauthorized Access!", success: false }
      }else{
        if(room.id == null){
          // Create a new room 
          room['users'] = [ socket ];
          if(room.isStream == true){
            room['stream.roomLeader'] = key.session_token
            room['stream.status'] = room.isStream
          }
          RoomModel.create(room).then(newroom=>{
            // Create Connection from user to socket
            ConnectionModel.create({
              user: key.session_token,
              socket: socket,
              room: newroom._id,
              system: newroom.system
            }, (err, connection)=>{})
            let user = SessionModel.findById(key.session_token)
            return { user, room: newroom, success: true }
          })
        }else{
          RoomModel.findById(room.id, (err, existingroom)=>{
            if(err){
              return { error: err, success: false }
            }else if(existingroom == null){
              return { error: "Room not found.", success: false }
            }else{
              return { user: key, room: existingroom, success: true }
            }
          })
        }
      }
    })
  }catch(err){
    return { error: err.message, success: false }
  }
}

const removeRoom = (id, authorization_token, socket) => {
  try{ 
    KeyModel.findOne({authorization_token}, (err, key)=>{
      if(err){
        return { error: err, success: false }
      }else if(key == null){
        return { error: "Unauthorized Access!", success: false }
      }else{
        RoomModel.findById(id, (err, existingroom)=>{
          if(existingroom.isStream == true && existingroom.stream.roomLeader == key.session_token){
            RoomModel.findByIdAndUpdate(id, {'stream.status': false}, (err, raw)=>{
              ConnectionModel.remove({ socket }, (err)=>{})
              return { room: raw, success: true }
            })
          }else if(existingroom.isStream == false){  
            return { error: "Non-stream rooms cannot be destroyed." , success: false}
          }else{
            return { error: "Unauthorized Access! Cannot be destroyed.", success: false }
          }
        })
      }
    })
  }catch(err){
    return { error: err.message, success: false }
  } 
}

const getRoom = (id) => RoomModel.findById(id, (err, room) => { return { room, success: true } });

const getUsersInRoom = (id) => RoomModel.findById(id, (err, room) => { 
  let users = []
  room.users.forEach(socket=>{
    ConnectionModel.findOne({ socket }, (err, connect)=>{
      users.push(user)
    })
  })
  return { users, success: true } 
});

module.exports = { addRoom, removeRoom, getRoom, getUsersInRoom };