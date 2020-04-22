'use strict';
const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express(); 

const { addUser, removeUser, getUser, getUsersInRoom } = require('./settings/users.settings');
const { addMessage } = require('./settings/message.settings');

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
  console.log(`✔️ Socket Server Started`);
  socket.on('join', ({ authorization_token, room }, callback) => {
    const { error, user } = addUser({ socket: socket.id, authorization_token, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'LYVE ADMIN', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'LYVE ADMIN', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })

  socket.on('sendMessage', ({message, streamTime}, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
    addMessage({socket: socket.id, message, streamTime})
    callback();
  }); 
});