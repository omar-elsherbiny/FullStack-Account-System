const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/Account_System');

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
    displayName: {
        type: String,
        required: false
    },
});

const collection = new mongoose.model('users', UserSchema);

module.exports = collection;