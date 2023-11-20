const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email.']
    }, 
    password: {
        type: String,
        require: true,
        minlength: [8, 'The minimum length of password is 8.']
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;