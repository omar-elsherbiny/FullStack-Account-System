require('dotenv').config();
const mongoose = require('mongoose');

['mongo_url'].forEach(envVar => {
    if (!process.env[envVar]) {
        throw Error(`Missing enviroment variable: ${envVar}`);
    }
});

const connect = mongoose.connect(process.env.mongo_url);

connect
    .then(() => {
        console.log('Database connected succesfully');
    })
    .catch(() => {
        console.log('Database connection failed');
    });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    memberSince: {
        type: Date,
        required: true
    },
    displayName: {
        type: String,
        required: false
    },
    aboutMe: {
        type: String,
        required: false
    },
    showMemberSince: {
        type: Boolean,
        required: false
    },
    pfpPath: {
        type: String,
        required: false
    },
    suspendedFrom: {
        type: Date,
        required: false
    },
});

const collection = new mongoose.model('users', UserSchema);

module.exports = collection;