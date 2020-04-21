'use strict';
var compose = require('composable-middleware');  
const KeyModel = require('../models/key.model');
const SessionModel = require('../models/session.model');

function isSessionSet() {
    return compose()
        // Attach user to request
        .use(function(req, res, next) { 
           SessionModel.findOne({_id: req.query.session_token}, (err, session)=>{ 
            if(session == null){
              res.send({
                success: false,
                message: "Authorization Error! Invalid Session Token."
              })
            }else{
              console.log("SESSION: ", session)
              req.user = session;
              next();
            }
           })
        });
} 

function isTokenValid() {
  return compose()
      // Attach user to request
      .use(isSessionSet())
      .use(function(req, res, next) { 
        KeyModel.findOne({authorization_token: req.query.authorization_token}, (err, key)=>{
          if(key == null){
            res.send({
              success: false,
              message: "Authorization Error! Invalid auth token."
            })
          }else{ 
            if(key.access == true){
              console.log("AUTH: ", key)
              req.auth = key;
              next();
            }else{
              res.send({
                success: false,
                message: "Authorization Error! Access blocked. Contact admin."
              })
            }
          }
         })
      });
} 

function isTokenAdmin() {
  return compose()
      // Attach user to request
      .use(isSessionSet())
      .use(isTokenValid())
      .use(function(req, res, next) {
        if(req.auth.access == true && req.auth.write == true && req.auth.read == true){
          next();
        }else{
          res.send({
            success: false,
            message: "Authorization Error! Not enough access granted."
          })
        }
      });
} 

function isAdmin() {
  return compose()
      // Attach user to request
      .use(isSessionSet()) 
      .use(isTokenAdmin())
      .use(function(req, res, next) {
         if(req.user.role == 'admin'){
           next();
         }
      });
}  

exports.isSessionSet = isSessionSet; 
exports.isTokenValid = isTokenValid; 
exports.isAdmin = isAdmin;
