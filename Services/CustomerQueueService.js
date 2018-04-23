'use strict';

var Models = require('../Models');

//create Client
var addQueue = function (objToSave, callback) {
    new Models.CustomerQueueModel(objToSave).save(callback);
};

var updateQueue = function (criteria, dataToSet, options, callback) {
    Models.CustomerQueueModel.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var getQueue = function (criteria, projection, options, callback) {
    Models.CustomerQueueModel.find(criteria, projection, options, callback);
};

var deleteQueue = function (criteria, callback) {
    Models.CustomerQueueModel.findOneAndRemove(criteria, callback);
};

module.exports = {
    addQueue: addQueue,
    updateQueue: updateQueue,
    getQueue: getQueue,
    deleteQueue: deleteQueue
};