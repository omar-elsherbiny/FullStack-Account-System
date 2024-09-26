const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.MONGO_URL);

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
    suspendedFrom: {
        type: Date,
        required: false
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
    memberSince: {
        type: Date,
        required: true
    },
    pfpPath: {
        type: String,
        required: false
    },
    pfpPath: {
        type: String,
        required: false
    },
    bannerPath: {
        type: String,
        required: false
    },
});

const collection = new mongoose.model('users', UserSchema);

module.exports = collection;