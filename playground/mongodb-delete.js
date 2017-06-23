//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient} = require('mongodb'); // this is same as above line. This is new feature in ES6 (Object destructuring)
const {MongoClient, ObjectID} = require('mongodb'); // Object destructuring can be used for multiple porperties

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err)
        return console.log('Unable to connect to MongoDB');

    // db.collection('Todos').deleteMany({text: 'delete this todo item'}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log(`Unable to delete the document ${err}`)
    // });

    // db.collection('Todos').deleteOne({text: 'delete this todo item'}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log(`Unable to delete the document ${err}`)
    // });

    db.collection('Todos').findOneAndDelete({
        _id: new ObjectID("594d03104b7af35c6254f423")
    }).then((result) => {
        console.log(result);
    }, (err) => {
         console.log(`Unable to delete the document ${err}`)
    });

   
    //db.close();
})