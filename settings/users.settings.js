const RoomModel = require('../models/room.model');
const KeyModel = require('../models/key.model');
const ConnectionModel = require('../models/connection.model');
const SessionModel = require('../models/session.model');

const users = [];

const addUser = ({ socket, authorization_token, room }) => {
  try {
    KeyModel.findOne({ authorization_token }, (err, key) => {
      if (err) {
        return { error: err }
      } else if (key == null) {
        return { error: "Unauthorized Access!" }
      } else {
        const myUser = SessionModel.findById(key.session_token)
        if (room == null) {
          return { error: "Room ID is required" }
        } else {
          RoomModel.findById(room, (err, existingroom) => {
            if (err) {
              return { error: err }
            } else if (existingroom == null) {
              return { error: "Room not found." }
            } else {
              const existingUser = users.find((user) => user.room === room && user.authorization_token === authorization_token);

              if (existingUser) return { error: 'User is taken.' };

              const user = { socket, authorization_token, room, name: myUser.name };

              users.push(user);
              createConnection({ socket, session_token: key.session_token, room, system: existingroom.system })
              
              return { user };
            }
          })
        }
      }
    })
  } catch (err) {
    return { error: err.message, success: false }
  }
}

const removeUser = (socket) => {
  try {
    const index = users.findIndex((user) => user.socket === socket);
    if (index !== -1) return users.splice(index, 1)[0];
    removeConnection(socket)
  } catch (err) {
    return { error: err.message, success: false }
  }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const createConnection = ({ socket, session_token, room, system }) => {
  ConnectionModel.create({
    user: session_token,
    socket: socket,
    room: room,
    system: system
  }, (err, connection) => {
    console.log("NEW CONNECTION MADE: ", connection)
  })
}

const removeConnection = (socket) => {
  ConnectionModel.remove({ socket }, (err) => {
    console.log("CONNECTION REMOVED")
  })
}
module.exports = { addUser, removeUser, getUser, getUsersInRoom };