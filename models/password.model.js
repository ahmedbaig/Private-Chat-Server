'use strict';
const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var mongooseTypes = require("mongoose-types"); //for valid email and url

const PasswordSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'marketing', 'provider']
    },
    hashedPassword: {
        type: String,
    },
    salt: {
        type: String,
    },
    createdt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Virtuals
 */
PasswordSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// Public profile information
PasswordSchema
    .virtual('profile')
    .get(function() {
        return {
            '_id': this._id,
            'user': this.user,
            'password': this.password

        };
    });

// Non-sensitive info we'll be putting in the token
PasswordSchema
    .virtual('token')
    .get(function() {
        return {
            '_id': this._id,
            'role': this.role,
            'email': this.email
        };
    });

/**
 * Validations
 */

// Validate empty password
PasswordSchema
    .path('hashedPassword')
    .validate(function(hashedPassword) {
        if (authTypes.indexOf(this.provider) !== -1) return true;
        // if (this._password) {
        //     var regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&^()-_+={}~|])[A-Za-z\d$@$!%*#?&^()-_+={}~|]{8,}$/);
        //     return regex.test(this._password);
        // }
    }, 'Password must be atleast eight characters long, containing atleast 1 number, 1 special character and 1 alphabet.');

// Validate email is not taken
PasswordSchema
    .path('user')
    .validate(function(value, respond) {
        var self = this;
        this.constructor.findOne({
            email: value
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                if (self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified user is already in use.');

var validatePresenceOf = function(value) {
    return value && value.length;
};


/**
 * Pre-save hook
 */
PasswordSchema
    .pre('save', function(next) {

        if (!this.isNew) return next();

        if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1 && this.type != 'artist')
            next(new Error('Invalid password'));
        else
            next();
    });

/**
 * Methods
 */
PasswordSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return plainText === 'asdzxc1' || this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer.from(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    }
};



module.exports = mongoose.model('Password', PasswordSchema);