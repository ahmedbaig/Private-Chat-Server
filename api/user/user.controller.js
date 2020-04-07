'use strict';

const fs = require('fs');
const path = require('path');
var crypto = require('crypto');


const UserService = require('./user.service');
const UserModel = require('./user.model'); 
const UtilService = require('../utility/util');
const htmlTemplateService = require('../utility/htmltemplates');
const UserSession = require('../userSession/userSession.model'); 
const _ = require('lodash');


function handleError(res,error,code){
    res.status(code).json(error);
}

// exports.create = function(req,res){
//     try{
//         UserService.create(req.body)
//         .then(async function(user){
//             let emailtoken = UtilService.generateRandomToken();
//             let htmlTemplate =  htmlTemplateService.accountActivation( user, emailtoken );
//             // sending email to user for account activation
//             await UtilService.sendEmail(user.email,'Account Activation',htmlTemplate)
          
//             // saving token in user model
//             await UserService.update({ _id : user._id },{ 'accountActivated.token': emailtoken })
            
//         }).then( function (){
//             // sending access token
//             res.send({
//                 success: true,
//                 message: "You have successfully signed up. Account activition email has been sent to your account"
//             }); 
//         })
//         .catch(function(error){
//             //console.log('error')
//             //console.log(error)
//             if(error.errors && error.errors.email && error.errors.email.message == 'The specified email address is already in use.'){
//                 res.send({message: 'The specified email address is already in use.', success: false})
//             }else if(error.errors && error.errors.email && error.errors.email.message == "Path `email` is required."){
//                 res.send({message: 'Email is required', success: false})
//             }else if(error.message == 'Invalid password'){
//                 res.send({message: 'Invalid password', success: false})
//             }else{
//                 handleError(res,error,500);
//             }
//         })
//     }catch(e){
//         res.send({
//             success: false,
//             message: e.message
//         })
//     }
    

// }

