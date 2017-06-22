//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient} = require('mongodb'); // this is same as above line. This is new feature in ES6 (Object destructuring)
const {MongoClient, ObjectID} = require('mongodb'); // Object destructuring can be used for multiple porperties

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err)
        return console.log('Unable to connect to MongoDB');

    db.collection('Todos').find().toArray().then((documents) => {
        console.log('Documents found');
        console.log(JSON.stringify(documents, null, 4));
    }, (err) => {
        console.log('Unable to find the documents');
    });

    db.collection('Todos').find({completed: true}).toArray().then((documents) => {
        console.log('Documents found');
        console.log(JSON.stringify(documents, null, 4));
    }, (err) => {
        console.log('Unable to find the documents');
    });

    db.collection('Todos').find({
        _id: new ObjectID("5947dc9193fdd429881cefb8")
    }).toArray().then((documents) => {
        console.log('Documents found');
        console.log(JSON.stringify(documents, null, 4));
    }, (err) => {
        console.log('Unable to find the documents');
    });

    db.collection('Todos').find().count().then((count) => {
        console.log(`No. of documents found: ${count}`);
    }, (err) => {
        console.log('Unable to find the documents');
    });
})