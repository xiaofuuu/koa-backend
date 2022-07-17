const Base64 = require('crypto-js/enc-base64');
const SHA256 = require("crypto-js/sha256");

console.log(Base64.stringify(SHA256('hello')))