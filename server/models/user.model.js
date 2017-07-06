const mongoose = require('mongoose');
const validatorUtil = require('validator');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'User email required'],
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            isAsync: false,
            validator: validatorUtil.isEmail,
            message: "{VALUE} is not a valid email"
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = function() {
    var user = this;
    
    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'secret1234').toString();

    user.tokens.push({access, token});

    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};