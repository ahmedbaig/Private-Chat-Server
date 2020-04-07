'use strict';


var path = require('path');

module.exports = function(app){

    app.use('/auth', require('./auth'));
    app.use('/api/user', require('./api/user'));
    app.use('/api/session', require('./api/userSession'));

    app.route('/*')
        .get(function(req, res) {
            // Commented path is for angular build post production
            res.sendFile(path.resolve( __dirname + '/dist/App/index.html'));
        });

};
