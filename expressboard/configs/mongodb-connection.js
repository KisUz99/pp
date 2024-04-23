require('dotenv').config();
const { MongoClient } = require("mongodb");
const { url } = process.env;

module.exports = function (callback) {
    return MongoClient.connect(url, callback);
};