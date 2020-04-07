'use strict';

const User = require('./userSession.model');


exports.create = function(userData){
    return new Promise(function(resolve,reject){
        User.create(userData,function(err,user){
            if(err){
                reject(err);
            }else{
                resolve(user);
            }
        })
        
    })
}

exports.findById = function(userId){
    return new Promise(function(resolve,reject){
        User.findById(userId,function(err,user){
            if(err){
                reject(err);
            }else if(!user){
                reject('User not found.');
            }else{
                resolve(user);
            }
        })
        
    })
}

exports.update = function(query,data,options){
    return new Promise(function(resolve,reject){
        User.update(query,data,options,function(err,result){
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
        
    })
}

exports.find = function(query){
    return new Promise(function(resolve,reject){
        User.find(query,function(err,users){
            if(err){
                reject(err);
            }else{
                resolve(users);
            }
        })
        
    })
}