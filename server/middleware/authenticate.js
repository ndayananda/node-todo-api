const {User} = require('../models/user.model');

// Create a middleware to handle the authentication seperately
// If the user is authenticated then only allow to proceed.
const authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    
    User.findByToken(token).then((user) => {
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send();
    });
};

module.exports = {
    authenticate
};