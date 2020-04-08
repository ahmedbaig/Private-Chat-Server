const RoomModel = require('../models/room.model');
const KeyModel = require('../models/key.model');
const ConnectionModel = require('../models/connection.model');
const SessionModel = require('../models/session.model');

const addUser = ({ socket, authorization_token, room }) => {
  try{
    console.log(socket, authorization_token, room)
    KeyModel.findOne({authorization_token}, (err, key)=>{
      if(err){
        return { error: err, success: false }
      }else if(key == null){
        return { error: "Unauthorized Access!", success: false }
      }else{
        if(room._id == null){
          return { error: "Room ID is required" }
        }else{
          RoomModel.findById(room._id, (err, existingroom)=>{
            if(err){
              return { error: err, success: false }
            }else if(existingroom == null){
              return { error: "Room not found.", success: false }
            }else{
              ConnectionModel.create({
                user: key.session_token,
                socket: socket,
                room: existingroom._id,
                system: existingroom.system
              }, (err, connection)=>{
                let users = existingroom.users
                users.push(socket)
                RoomModel.findByIdAndUpdate(room.id, {users}, (err, raw)=>{
                  SessionModel.findById(key.session_token, (err, user)=>{
                    return { user: user, room: raw, success: true }
                  })
                })
              })
            }
          })
        }
      }
    })
  }catch(err){
    return { error: err.message, success: false }
  }
}

const removeUser = (socket) => {
  try{ 
    ConnectionModel.findOne({socket}, (err,connection)=>{
      RoomModel.findById(connection.room, (err, room)=>{
        let users = room.users
        const index = users.findIndex((user) => user.id === id);
        if(index !== -1){
          users.splice(index, 1)[0]
          RoomModel.findByIdAndUpdate(room._id, {users}, (err, raw)=>{
            SessionModel.findById(connection.user, (err, user)=>{
              return { user: user, success: true }
            })
          })
        };
      })
    }) 
  }catch(err){
    return { error: err.message, success: false }
  }
}

const getUser = (socket) => {
  ConnectionModel.findOne({socket}, (err,connection)=>{
    SessionModel.findById(connection.user, (err, user)=>{
      return { user: user, success: true }
    })
  }) 
};

module.exports = { addUser, removeUser, getUser };