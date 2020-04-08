'use strict';
const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express(); 

const { addRoom, removeRoom, getRoom, getUsersInRoom  } = require('./settings/room.settings');
const { addUser, removeUser, getUser } = require('./settings/users.settings');
const { addMessage, getMessages } = require('./settings/message.settings');

const PORT = process.env.PORT;
global.ROOTPATH = __dirname;


require('./config')(app);
require('./routes')(app);

// Server Listen & Chat Server Init
const server = app.listen(PORT, function() {
  console.log(`✔️ Server Started (listening on PORT : ${PORT})`);
});

const io = require('socket.io').listen(server)

io.on('connect', (socket) => {
  socket.on('join', ({ authorization_token, room }, callback) => {
    if(room.id == null){
      // Creating new room
      let addRoomResonse = addRoom({ authorization_token, room, socket: socket.id }); 
      if(addRoomResonse.success){
        let { user, new_room } = addRoomResonse
      }else{
        return callback(addRoomResonse.error);
      }
      io.to(new_room.users).emit('roomData', { room: getRoom(new_room._id), users: getUsersInRoom(new_room._id) });
      socket.join(new_room._id);
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome.`});
      socket.broadcast.to(new_room._id).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    }else{
      // Room already exists
      const addUserResponse = addUser({ socket: socket.id, authorization_token, room });
      if(addUserResponse.success){
        let { user, room_update } = addRoomResonse
      }else{
        return callback(addUserResponse.error);
      }
      io.to(room_update.users).emit('roomData', { room: getRoom(room_update._id), users: getUsersInRoom(room_update._id) });
      socket.join(room_update._id);
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome.`});
      socket.broadcast.to(room_update._id).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    }
    callback();
  });

  socket.on('disconnect', (id, authorization_token) => {
    const removeRoomResponse = removeRoom(id, authorization_token);
    if(removeRoomResponse.success){
      let { room } = removeRoomResponse
    }else{
      return callback(removeRoomResponse.error);
    }
    let user = removeUser(socket.id);
    if(room){
      io.to(room.users).emit('message', { user: 'admin', text: `${room.roomName} has been closed.` });
    }
    if(user) {
      io.to(room.users).emit('message', { user: 'admin', text: `${user.name} has left.` });
      io.to(room.users).emit('roomData', { room: getRoom(id), users: getUsersInRoom(id)});
    }
  })

  socket.on('sendMessage', (id, authorization_token, message, callback) => {
    let { room } = getRoom(id)
    let { user } = getUser(socket.id);
    let addMessageRepose = addMessage(id, authorization_token, message)
    io.to(room.users).emit('message', { user: user.name, text: message });

    callback();
  }); 
});