const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo.model');
const {User} = require('../../models/user.model');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users=[{
    _id: userOneId,
    email: 'naveen@example.com',
    password: 'userOnePassword',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'malini@example.com',
    password: 'userTwoPassword'
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save(); // Create an user instance and then save. which will return a promise
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    });
};

const todos = [{
    _id: new ObjectID(),
    text: 'Test todo item 1',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Test todo item 2',
    _creator: userTwoId
}];

var populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};

module.exports = {todos, populateTodos, users, populateUsers};