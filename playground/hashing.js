//const {SHA256} = require('crypto-js');
//const jwt = require('jsonwebtoken'); // Used for creating auth token and validate token
const bcrypt = require('bcryptjs');

/** Hashing and Salting using bcryptjs for password*/
var password = "We!come123!";

// bcrypt.genSalt(10, (err, salt) => { // This will generate the SALT
//     bcrypt.hash(password, salt, (err, hash) => { // This will create a HASH using the SALT
//         console.log(hash);
//     })
// });

var hashedPassword = '$2a$10$z2dFIQH99gXnypp9zDLB5OCVZ8oAqd0YLK.pkpl7I2KQZ840otsOu';

bcrypt.compare("We!come123!", hashedPassword, (err, result) => {
    console.log(result);
});

bcrypt.compare("we!come123!", hashedPassword, (err, result) => {
    console.log(result);
});






/** Hashing and Salting using JWT to create JWT auth tokens*/
// var data = {
//     id: 10
// };
// var token = jwt.sign(data, 'secret1234');
// console.log('Token: ', token);

// var decoded = jwt.verify(token, 'secret1234');
// console.log('Decoded: ', decoded);



/** Hashing and Salting using cryptoJS and SHA256 algorithm */
// var message = "I'm user number 4";
// var hash = SHA256(message).toString();

// console.log('Message: ', message);
// console.log('Hash: ', hash);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// token.data.id = 5;
// token.data.hash = SHA256(JSON.stringify(data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data is not changed');
// } else {
//     console.log('Data is changed. Do not trust');
// }