'use strict';


var path = require('path');

module.exports = function(app){

    app.use('/auth', require('./auth')); 
    app.use('/messages', require('./api/messages')); 
    app.use('/rooms', require('./api/rooms')); 
    app.use('/session', require('./api/sessions')); 

    app.route('/*')
        .get(function(req, res) {
            // Commented path is for angular build post production
            res.sendFile(path.resolve( __dirname + '/build/index.html'));
        });

};
