const SessionModel = require('../models/session.model');
const RoomModel = require('../models/room.model');
const ConnectionModel = require('../models/connection.model');
const MessageModel = require('../models/message.model');

const addMessage = ({ socket, message, streamTime }) => {
    ConnectionModel.findOne({ socket }, (err, connection) => {
        SessionModel.findById(connection.user, (err, user) => {
            MessageModel.create({
                name: user.name,
                meta: user.meta,
                to: connection.room,
                from: connection.user,
                streamTime: streamTime,
                message
            }, (err, message) => {
                return {
                    success: true,
                    message
                }
            })
        })
    })
}

module.exports = { addMessage };