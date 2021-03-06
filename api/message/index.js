'use strict';

const express = require('express');
const controller = require('./messages.controller');
const middleware = require('../../auth/middleware.service')
const router = express.Router();

router.get('/livechat-messages', middleware.isTokenValid(), controller.livechatMessages);

router.post('/livechat-insert-message', middleware.isTokenValid(), controller.insertLiveChatMessage)

module.exports = router;
