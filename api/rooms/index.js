'use strict';

const express = require('express');
const controller = require('./rooms.controller');
const middleware = require('../../auth/middleware.service')
const router = express.Router();

router.get('/room-connections', middleware.isAdmin(), controller.activeConnections);

router.post("/create-room", middleware.isTokenValid(), controller.createRoom);

router.post("/remove-room", middleware.isTokenValid(), controller.removeRoom);

router.get("/get-rooms", middleware.isTokenValid(), controller.getRooms);

router.get("/get-room", middleware.isAdmin(), controller.getRoom);

router.get("/get-room-users", middleware.isTokenValid(), controller.getUsersInRoom);

module.exports = router;
