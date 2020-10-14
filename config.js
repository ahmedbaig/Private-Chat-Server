'use strict';
const express = require('express');
const dynamicMiddleware = require('express-dynamic-middleware');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const busboyBodyParser = require('busboy-body-parser');
const path = require('path');
const fs = require('fs');
var cors = require('cors');

const PORT = process.env.PORT;
global.ROOTPATH = __dirname;

const _ = require('lodash');
const moment = require('moment');

module.exports = function(app){
  // Mongo Connections
  let uri = `mongodb+srv://${process.env.MLAB_USER}:${process.env.MLAB_PASSWORD}${process.env.MLAB_URL}`
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log(`✔️ Database Connected`);
    })
    .catch(err => {

      console.error('❗️ MongoDB connection error: ' + err);
      process.exit(-1);
    })
  // CORS STUFF
  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', "access-control-allow-headers,access-control-allow-origin,content-type");

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Dist Setup
  app.use(express.static(path.join(__dirname, 'images')));
  app.use(express.static(path.join(__dirname, 'build/')));
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(busboyBodyParser());

  // Packages running
  app.use('/auth', require('./auth'));
  app.locals.moment = require('moment');
  require('./files')(app);
};
