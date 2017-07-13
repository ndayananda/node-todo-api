require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo.model');
const {User} = require('./models/user.model');
const {authenticate} = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send({
            success: true,
            data: doc
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            success: true,
            data: todos
        })
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    Todo.find({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo)
            res.send({
                success: false,
                message: 'Document not found'
            });
        
        res.send({
            success: true,
            data: todo
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos', authenticate, (req, res) => {
    Todo.remove({_creator: req.user._id}).then((data) => {
        res.send({
            success: true,
            data: {
                count: data.result.n
            }
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo)
            return res.status(404).send();
            
        res.send({
            success: true,
            data: todo
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(404).send();

    // Create a copy of response body object
    // User should not be able to update completedAt time and id
    // CompletedAt is the timestamp which will be set when completed is set to true dynamically
    var body = _.pick(req.body, ['text', 'completed']);

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
        $set: body
    }, {
        new: true // this will return the new updated document. By default it will be false and old document will be returned
    }).then((todo) => {
        if(!todo)
            return Promise.reject();
        
        res.send({
            success: true,
            data: todo
        });
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
     var user = new User(body);
     
     var token = user.generateAuthToken();

     user.save().then((doc) => {
        res.header('x-auth', token).send({
            success: true,
            data: doc
        });
     }).catch((err) => {
        res.status(400).send(err);
     });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/login', (req, res) => {
    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        res
            .header('x-auth', user.generateAuthToken())
            .send({
                success: true,
                data: user
            });
    }).catch((err) => {
        res.status(401).send({
            success: false,
            error: {
                message: 'Please enter valid email/password'
            }
        })
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    // Using the authenticate middleware to check authenticated user
    // If user is authenticated then user & token will be added to the request in a
    req.user.removeToken(req.token).then(() => {
        res.send({
            success: true,
            data: {
                message: 'Logged out successfully'
            }
        });
    }).catch((err) => {
        res.status(400).send();
    });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port: ', port);
});

module.exports = {
    app
};