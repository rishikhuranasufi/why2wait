'use strict';

var mongoose = require('mongoose');
var Config = require('../Config');
var Service = require('../Services');

//Connect to MongoDB
mongoose.connect(Config.dbConfig.mongo.URI, {useMongoClient: true}, function (err) {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected');
    }
});