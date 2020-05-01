'use strict';

const KeyModel = require('../models/key.model');
const SessionModel = require('../models/session.model');
const PasswordModel = require('../models/password.model');

exports.createAdmin = async function(req, res) {
    try {
        if (req.body.auth_key == process.env.PRIVATE_AUTH_KEY) {
            await PasswordModel.findOne({ user: req.body.user }, async(err, user) => {
                if (err) {
                    res.send({
                        success: false,
                        message: e
                    })
                } else if (user == null) {
                    await PasswordModel.create(req.body).then(user => {
                        res.send({
                            success: true,
                            user
                        })
                    })
                } else {
                    res.send({
                        success: false,
                        message: "User already taken"
                    })
                }
            })
        }
    } catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
}

exports.loginAdmin = async function(req, res) {
    try {
        if (req.body != undefined || req.body != "{}") {
            var { user, password } = req.body;
            PasswordModel.findOne({
                user: user,
            }, async function(err, user) {
                if (err) { res.send({ success: false, message: err }) } else if (!user) {
                    //console.log(user);
                    return res.send({
                        success: false,
                        message: 'This user is not registered.'
                    });
                } else {
                    const variation = user;
                    if (!user.authenticate(password)) {
                        return res.send({
                            success: false,
                            message: 'This password is not correct.'
                        });
                    } else {
                        await SessionModel.findOne({ user: req.body.user }, async(err, user) => {
                            if (err) {
                                res.send({
                                    success: false,
                                    message: e
                                })
                            } else if (user == null) {
                                res.send({
                                    success: false,
                                    message: "User session not found"
                                })
                            } else {
                                await KeyModel.findOne({ session_token: user._id }, async(err, key) => {
                                    if (err) {
                                        res.send({
                                            success: false,
                                            message: err
                                        })
                                    }
                                    if (key == null) {
                                        res.send({
                                            success: false,
                                            message: "Authorization Token was not generated",
                                            session: user
                                        })
                                    }
                                    res.send({
                                        success: true,
                                        message: "User session already exists.",
                                        authorization_token: key.authorization_token,
                                        session: user
                                    })
                                })
                            }
                        })
                    }
                }
            });
        } else {
            return res.send({
                success: false,
                message: "Please enter email and password"
            })
        }
    } catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
}

exports.createSession = async function(req, res) {
    try {
        if (req.body.auth_key == process.env.PUBLIC_AUTH_KEY) {
            await SessionModel.findOne({ user: req.body.user }, async(err, user) => {
                if (err) {
                    res.send({
                        success: false,
                        message: e
                    })
                } else if (user == null) {
                    await SessionModel.create(req.body).then(session => {
                        res.send({
                            success: true,
                            session
                        })
                    })
                } else {
                    await KeyModel.findOne({ session_token: user._id }, async(err, key) => {
                        if (err) {
                            res.send({
                                success: false,
                                message: err
                            })
                        }
                        if (key == null) {
                            res.send({
                                success: false,
                                message: "Authorization Token was not generated",
                                session: user
                            })
                        }
                        res.send({
                            success: true,
                            message: "User session already exists.",
                            authorization_token: key.authorization_token,
                            session: user
                        })
                    })
                }
            })
        } else {
            res.send({
                success: false,
                message: 'Authorization Error!'
            })
        }
    } catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
}

exports.createToken = async function(req, res) {
    try {
        if (req.body.auth_key == process.env.PUBLIC_AUTH_KEY) {
            await SessionModel.findById(req.body.session_token, async(err, user) => {
                console.log(err, user)
                if (err) {
                    res.send({
                        success: false,
                        message: e
                    })
                } else if (user == null) {
                    res.send({
                        success: false,
                        message: "Authorization Error! Invalid Session Token."
                    })
                } else {
                    /*
                      auth_key
                      authorization_token
                      session_token
                    */
                    await KeyModel.create(req.body, async(err, key) => {
                        if (err) {
                            res.send({
                                success: false,
                                message: err
                            })
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
        } else {
            res.send({
                success: false,
                message: 'Authorization Error!'
            })
        }
    } catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
}

exports.deleteToken = async function(req, res) {
    try {
        if (req.body.auth_key == process.env.PRIVATE_AUTH_KEY) {
            await KeyModel.findOne({ authorization_token }, (err, key) => {
                if (key == null) {
                    res.send({
                        success: false,
                        message: 'Authorization Error! Key not found'
                    })
                } else {
                    SessionModel.remove({ _id: key.session_token }, (err) => {
                        if (err) {
                            res.send({
                                success: true,
                                message: err
                            })
                        }
                    })
                }
            })
            await KeyModel.remove({ authorization_token: req.body.authorization_token }, (err) => {
                if (err) {
                    res.send({
                        success: true,
                        message: err
                    })
                }
                res.send({
                    success: true,
                    message: "Authorization Token Removed."
                })
            })
        } else {
            res.send({
                success: false,
                message: 'Authorization Error!'
            })
        }
    } catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
}

exports.changePermission = async function(req, res) {
    try {
        if (req.body.auth_key == process.env.PRIVATE_AUTH_KEY) {
            await KeyModel.findOneAndUpdate({
                authorization_token: req.body.authorization_token
            }, {
                access: req.body.access,
                write: req.body.write,
                read: req.body.read
            }, (err, raw) => {
                if (err) {
                    res.send({
                        success: false,
                        message: err
                    })
                }
                res.send({
                    success: true,
                    message: "Authorization Token Updated.",
                    raw
                })
            })
        } else {
            res.send({
                success: false,
                message: 'Authorization Error!'
            })
        }
    } catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
}

exports.checkUser = async function(req, res) {
    try {
        await KeyModel.findOne({ authorization_token: req.auth.authorization_token }, async(err, key) => {
            if (err) {
                res.send({
                    success: false,
                    message: err
                })
            }
            if (key == null) {
                res.send({
                    success: false,
                    message: 'Authorization Error!'
                })
            } else {
                await SessionModel.findById(key.session_token, async(err, session) => {
                    if (err) {
                        res.send({
                            success: false,
                            message: err
                        })
                    }
                    if (session == null) {
                        res.send({
                            success: false,
                            message: 'Authorization Error! Please contact admin.'
                        })
                    } else {
                        res.send({
                            success: true,
                            message: "Valid Authorization Key",
                            session
                        })
                    }
                })
            }
        })
    } catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
}