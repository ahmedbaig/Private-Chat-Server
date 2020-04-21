'use strict';


var path = require('path');

module.exports = function(app){

    app.use('/auth', require('./auth')); 
    app.use('/api/messages', require('./api/message')); 
    app.use('/api/rooms', require('./api/rooms')); 
    app.use('/api/session', require('./api/sessions')); 

    app.route('/*')
        .get(function(req, res) {
            // Commented path is for angular build post production
            res.sendFile(path.resolve( __dirname + '/build/index.html'));
        });

};
