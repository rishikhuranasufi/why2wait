'use strict';

var Models = require('../Models');

//create Client
var createClient = function (objToSave, callback) {
    new Models.ClientModel(objToSave).save(callback);
};

var updateClient = function (criteria, dataToSet, options, callback) {
    Models.ClientModel.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var getClient = function (criteria, projection, options, callback) {
    Models.ClientModel.find(criteria, projection, options, callback);
};

var deleteClient = function (criteria, callback) {
    Models.ClientModel.findOneAndRemove(criteria, callback);
};

module.exports = {
    createClient: createClient,
    updateClient: updateClient,
    getClient: getClient,
    deleteClient: deleteClient
};