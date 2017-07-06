//const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};
var token = jwt.sign(data, 'secret1234');
console.log('Token: ', token);

var decoded = jwt.verify(token, 'secret1234');
console.log('Decoded: ', decoded);

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