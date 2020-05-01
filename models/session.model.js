'use strict';
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    system: {
        type: String,
        required: true,
        enum: ['sply', 'lyve']
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'marketing', 'provider']
    },
    meta: String,
    createdt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', SessionSchema);