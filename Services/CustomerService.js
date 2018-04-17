'use strict';

var Models = require('../Models');

//create Client
var addService = function (objToSave, callback) {
    new Models.CustomerModel(objToSave).save(callback);
};

var updateService = function (criteria, dataToSet, options, callback) {
    Models.CustomerModel.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var getService = function (criteria, projection, options, callback) {
    Models.CustomerModel.find(criteria, projection, options, callback);
};

var deleteService = function (criteria, callback) {
    Models.CustomerModel.findOneAndRemove(criteria, callback);
};

module.exports = {
    addService: addService,
    updateService: updateService,
    getService: getService,
    deleteService: deleteService
};