'use strict';

const express = require('express');
const controller = require('./connections.controller');
const middleware = require('../../auth/middleware.service')
const router = express.Router();

router.get('/room-connections', middleware.isAdmin(), controller.activeConnections);

module.exports = router;
