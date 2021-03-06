const mongoose = require('mongoose');
const validatorUtil = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

userSchema.pre('save', function(next) {
    var user = this;
    
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// This is how we can override Model default methods
// By default user object will have id, email, password, tokens. We should only return id & email.
userSchema.methods.toJSON = function() {
    var user = this;

    return _.pick(user, ['_id', 'email']);
};

// This is how we add custom methods to Model.
userSchema.methods.generateAuthToken = function() {
    var user = this;
    
    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});
    user.save();

    return token;
};

userSchema.methods.removeToken = function(token) {
    var user = this;

    // invoke mongodb update method on user.
    // using $pull operator which removes all instances of a value from an existing array
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

userSchema.statics.findByToken = function(token) {
    var User = this;

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err)
                return reject(err);
            
            User.findOne({
                '_id': decoded._id,
                'tokens.token': token,
                'tokens.access': "auth"
            }).then((user) => {
                if(!user)
                    return reject();
                
                resolve(user);
            });
        });
    });  
};

userSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    
    return User.findOne({email}).then((user) => {
        if(!user || !password)
            return Promise.reject();

        return bcrypt.compare(password, user.password).then((success) => {
            if(!success)
                return Promise.reject();

            return user;
        })
    });
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};