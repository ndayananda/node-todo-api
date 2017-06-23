//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient} = require('mongodb'); // this is same as above line. This is new feature in ES6 (Object destructuring)
const {MongoClient, ObjectID} = require('mongodb'); // Object destructuring can be used for multiple porperties

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err)
        return console.log('Unable to connect to MongoDB');

    // db.collection('Todos').updateOne({
    //     text: 'Todo item 2'
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to update the document:', err);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5947dc9193fdd429881cefb9")
    }, {
        $set: {
            name: 'Naveen Malini'
        },
        $inc: {
            age: -1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to update the document:', err);
    });

    //db.close();
})