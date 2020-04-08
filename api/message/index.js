'use strict';

const express = require('express');
const controller = require('./messages.controller');
const middleware = require('../../auth/middleware.service')
const router = express.Router();

router.get('/livechat-messages', controller.livechatMessages);

module.exports = router;
