//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient} = require('mongodb'); // this is same as above line. This is new feature in ES6 (Object destructuring)
const {MongoClient, ObjectID} = require('mongodb'); // Object destructuring can be used for multiple porperties

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err)
        return console.log('Unable to connect to MongoDB');

    db.collection('Todos').insertOne({
        text: 'Todo item 2',
        completed: false
    }, (err, result) => {
        if(err)
            return console.log('Unable to insert todo', err);

        console.log(JSON.stringify(result.ops, null, 4));
    });

    db.collection('Users').insertOne({
        name: 'Naveen Dayananda',
        age: 34,
        location: 'Attibele, Bengalore, Karnataka'
    }, (err, result) => {
        if(err)
            return console.log('Unable to create user ', err);

        console.log(JSON.stringify(result.ops, null, 4));
    });

    db.close();
})