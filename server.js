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
    console.log(`✔️ Socket Started`, socket.id);

    socket.on('join', ({ authorization_token, room }, callback) => {
        addUser({ socket: socket.id, authorization_token, room }).then(({ user }) => {

            socket.join(user.room);

            socket.emit('message', { user: 'ADMIN', text: `${user.name}, welcome to chat room.`, userData: user, t: Date.now(), i: true, id: user._id });
            socket.broadcast.to(user.room).emit('message', { user: 'ADMIN', text: `${user.name} has joined!`, t: Date.now(), i: true, id: user._id });

            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

            callback();
        }).catch(({ error }) => {
            if (error) return callback(error);
        });
    });

    socket.on('room', () => {
        const user = getUser(socket.id);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'ADMIN', text: `${user.name} has left.`, i: true });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })

    socket.on('sendMessage', ({ message, streamTime }) => {
        if (message != socket.id) {
            setTimeout(() => {
                const user = getUser(socket.id);
                if (message == null && message == undefined) {
                    socket.emit('message', { user: 'ADMIN', text: `${user.name}, you can't send blank messages to chat room.`, userData: user, i: true });
                } else {
                    if (user.hasOwnProperty('room')) {
                        io.to(user.room).emit('message', { user: user.name, text: message, userData: user, t: Date.now(), i: false });
                        addMessage({ socket: socket.id, message, streamTime })
                    }
                }
            }, 1000)
        }
    });
});