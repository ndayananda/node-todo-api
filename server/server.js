const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000, () => {
    console.log('Server started on port: 3000')
});

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