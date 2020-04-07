'use strict';

const express = require('express');
const auth = require('./auth.service');
const middleware = require('./middleware.service')
const router = express.Router();

router.post('/create-session' , auth.createSession);

router.post('/create-token' , middleware.isSessionSet() , auth.createToken);

router.get('/check-user', middleware.isTokenValid(), auth.checkUser);

router.post('/admin/change-permission' , middleware.isAdmin() , auth.changePermission);

router.post('/admin/delete-session' , middleware.isAdmin() , auth.deleteToken);

module.exports = router;
