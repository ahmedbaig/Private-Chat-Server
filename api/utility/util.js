'use strict';

// Nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'dummyemail@gmail.com', // generated ethereal user
        pass: '123456abc@'  // generated ethereal password
    }
});

exports.sendEmail = function(to,subject,html){
    return new Promise(function(resolve,reject){
        
        
        let mailOptions = {
            from: 'smtp.gmail.com', // sender address
            to: to, // list of receivers
            subject: subject,
            html: html
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                //console.log(error);
                reject(error);
            }else{
                resolve();
            }           
        });
          
    })
}