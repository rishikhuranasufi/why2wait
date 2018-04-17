'use strict';

var Models = require('../Models');

//Add Country
var addCountry = function (objToSave, callback) {
    new Models.CountryModel(objToSave).save(callback);
};

var addState = function (criteria, dataToSet, options, callback) {
    Models.CountryModel.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var addCity = function (criteria, dataToSet, options, callback) {
    Models.CountryModel.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var findCountry = function(criteria, projection, options, callback){
    Models.CountryModel.find(criteria, projection, options, callback);
}

var update = function(criteria, projection, options, callback){
    Models.CountryModel.findOneAndUpdate(criteria, projection, options, callback);
}

module.exports = {
    addCountry: addCountry,
    addState: addState,
    addCity: addCity,
    findCountry: findCountry,
    update: update
};