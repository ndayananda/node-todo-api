require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo.model');
const {User} = require('./models/user.model');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            success: true,
            data: todos
        })
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findById(id).then((todo) => {
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

app.delete('/todos', (req, res) => {
    Todo.remove({}).then((data) => {
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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findByIdAndRemove(id).then((todo) => {
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

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true // this will return the new updated document. By default it will be false and old document will be returned
    }).then((todo) => {
        if(!todo)
            return res.status(404).send();
        
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
     console.log(user);
     var token = user.generateAuthToken();

     user.save().then((doc) => {
        res.header('x-auth', token).send({
            success: true,
            data: _.pick(doc, ['_id', 'email'])
        });
     }).catch((err) => {
        res.status(400).send(err);
     });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port: ', port);
});

module.exports = {
    app
};