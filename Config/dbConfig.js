'use strict';

var mongo = {
    URI: 'mongodb://localhost/demo',
    port: 27017
};

var express = {
    port: 9090
};


module.exports = {
    mongo: mongo,
    express: express
};