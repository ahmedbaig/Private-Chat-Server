'use strict';

const KeyModel = require('../models/key.model');
const SessionModel = require('../models/session.model');

function handleError(message){
  res.send({
    success: false,
    message
  })
}

exports.createSession = async function (req, res){
  try{
    if(req.body.auth_key==process.env.PUBLIC_AUTH_KEY){ 
      await SessionModel.findOne({user:req.body.user}, async (err, user)=>{
        if(err){
          handleError(e)
        }else if(user == null){ 
          await SessionModel.create(req.body).then(session=>{
            res.send({
              success: true,
              session
            })
          })
        }else{
          await KeyModel.findOne({session_token:user._id}, {authorization_token}, async (err, key)=>{
            if(err){
              handleError(err)
            }
            res.send({
              success: true,
              message: "User session already exists.",
              authorization_token: key.authorization_token,
              session
            })
          })
        }
      })
    }else{
      handleError('Authorization Error!')
    }
  }catch(e){
    handleError(e.message)
  }
}

exports.createToken = async function (req, res){
  try{
    if(req.body.auth_key==process.env.PUBLIC_AUTH_KEY){ 
      await SessionModel.findById(req.body.session_token, async (err, user)=>{
        if(err){
          handleError(e)
        }else if(user == null){ 
          handleError("Authorization Error! Invalid Session Token.")
        }else{
          /*
            auth_key
            authorization_token
            session_token
          */
          await KeyModel.create(req.body, async (err, key)=>{
            if(err){
              handleError(err)
            }
            res.send({
              success: true,
              message: "User authorization token created.",
              authorization_token: key.authorization_token,
              session: user
            })
          })
        }
      })
    }else{
      handleError('Authorization Error!')
    } 
  }catch(e){
    handleError(e.message)
  }
}

exports.deleteToken = async function (req, res){
  try{
    if(req.body.auth_key==process.env.PRIVATE_AUTH_KEY){
      await KeyModel.remove({authorization_token: req.body.authorization_token}, (err)=>{
        if(err){
          handleError(err)
        }
        res.send({
          success: true,
          message: "Authorization Token Removed."
        })
      })
    }else{
      handleError('Authorization Error!')
    } 
  }catch(e){
    handleError(e.message)
  }
}

exports.changePermission = async function (req, res){
  try{
    if(req.body.auth_key==process.env.PRIVATE_AUTH_KEY){
      await KeyModel.findOneAndUpdate({
        authorization_token: req.body.authorization_token
      }, {
        access: req.body.access,
        write: req.body.write,
        read: req.body.read
      }, (err, raw)=>{
        if(err){
          handleError(err)
        }
        res.send({
          success: true,
          message: "Authorization Token Updated.",
          raw
        })
      })
    }else{
      handleError('Authorization Error!')
    } 
  }catch(e){
    handleError(e.message)
  }
}

exports.checkUser = async function (req, res){
  try{
    await KeyModel.findOne({authorization_token:req.body.authorization_token}, async (err, key)=>{
      if(err){
        handleError(err)
      }
      if(key == null){
        handleError('Authorization Error!')
      }else{
        await SessionModel.findById(key.session_token, async (err, session)=>{
          if(err){
            handleError(err)
          }
          if(session == null){
            handleError('Authorization Error! Please contact admin.')
          }else{
            res.send({
              success: true,
              message: "Valid Authorization Key",
              session
            })
          }
        })
      }
    })
  }catch(e){
    handleError(e.message)
  }
} 