const RoomModel = require('../models/room.model');
const KeyModel = require('../models/key.model');
const ConnectionModel = require('../models/connection.model');
const SessionModel = require('../models/session.model');

const users = [];

const addUser = ({ socket, authorization_token, room }) => {
    try {
        return new Promise((resolve, reject) => {
            console.log(socket, authorization_token, room)
            KeyModel.findOne({ authorization_token }, (err, key) => {
                if (err) {
                    reject({ error: err })
                } else if (key == null) {
                    reject({ error: "Unauthorized Access!" })
                } else {
                    if (room == null) {
                        reject({ error: "Room ID is required" })
                    } else {
                        RoomModel.findById(room, (err, existingroom) => {
                            if (err) {
                                reject({ error: err })
                            } else if (existingroom == null) {
                                reject({ error: "Room not found." })
                            } else {
                                console.log("Adding new user to room", existingroom.name)

                                const existingUser = users.find((user) => user.room === room && user.authorization_token === authorization_token);

                                SessionModel.findById(key.session_token, (err, myUser) => {
                                    const user = { socket, authorization_token, room, name: myUser.name, meta: myUser.meta, _id: myUser._id };
                                    if (!existingUser) {
                                        users.push(user);
                                    }
                                    // else {
                                    //     reject({ error: 'User is taken.' });
                                    // }
                                    createConnection({ socket, session_token: key.session_token, room, system: existingroom.system })
                                    resolve({ user });
                                })

                            }
                        })
                    }
                }
            })
        })
    } catch (err) {
        return { error: err.message, success: false }
    }
}

const removeUser = (socket) => {
    try {
        removeConnection(socket)
        const index = users.findIndex((user) => user.socket === socket);
        if (index !== -1) return users.splice(index, 1)[0];
    } catch (err) {
        return { error: err.message, success: false }
    }
}

const getUser = (id) => users.find((user) => user.socket === id);

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
    console.log("REMOVING CONNECTION")
    ConnectionModel.remove({ socket }, (err) => {
        console.log("CONNECTION REMOVED")
    })
}
module.exports = { addUser, removeUser, getUser, getUsersInRoom };