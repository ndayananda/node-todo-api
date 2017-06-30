const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo.model');

var id = "595264841604f91d8c82bc95AD";

Todo.find({
    _id: id
}).then((todos) => {
    if(!todos.length)
        return console.log('document not found');

    console.log('Using Find Method: ', todos);
    console.log('--------------------------------------------');
}).catch((err) => {
    console.log(err);
});

Todo.findOne({
    completed: false
}).then((todo) => {
    if(!todo)
        return console.log('document not found');

    console.log('Using Find One Method: ', todo);
    console.log('--------------------------------------------');
}).catch((err) => {
    console.log(err);
});

Todo.findById(id).then((todo) => {
    if(!todo)
        return console.log('document not found');

    console.log('Using FindById Method: ', todo);
    console.log('--------------------------------------------');
}).catch((err) => {
    console.log('ID is invalid', err);
});