const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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

    Todo.findByIdAndRemove().then((todo) => {
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port: ', port);
});

module.exports = {
    app
};

// const todo1 = new Todo({
//     text: 'Todo item 4',
//     completed: false
// });

// todo1.save().then((doc) => {
//     console.log('Todo Saved', doc);
// }, (err) => {
//     console.log('Unable to save the todo', err);
// });



// const naveen = new User({
//     email: ' '
// });

// naveen.save().then((doc) => {
//     console.log('User Saved', doc);
// }, (err) => {
//     console.log('Unable to save the user', err);
// });