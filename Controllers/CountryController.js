var Joi = require('joi');
var async = require('async');
var Controller = require('../Controllers');
var appSchema = require('../Routes/AppSchema');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Service = require('../Services');
var AppConstants = require('../Config/appConstants');

var _ = require('lodash');

var addOneCountry = function(payloadData, callback){
    var dataToSave = payloadData;

    var countryData = {};

    async.series([

        function(cb){

            var criteria = {
               country: dataToSave.country
            };

            var projection = {};

            var options = {
                lean: true
            };

            Service.CountryService.findCountry(criteria, projection, options, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{       
                    if(dataFromDB && dataFromDB.length > 0){
                        cb(AppConstants.STATUS_MSG.ERROR.COUNTRY_EXIST);
                    }
                    else{
                        cb();
                    }
                }
            })
        },

        function(cb){

            Service.CountryService.addCountry(dataToSave, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{              
                    countryData = dataFromDB;
                    cb();
                }
            })
        }
    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, countryData);
        }
    })
}

var addOneState = function(payloadData, callback){
    var dataToSave = payloadData;
    var countryData = {};

    async.series([

        function(cb){

            var criteria = {
               country: dataToSave.country
            };

            var projection = {};

            var options = {
                lean: true
            };

            Service.CountryService.findCountry(criteria, projection, options, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{
                    countryData = dataFromDB[0];      
                    if(dataFromDB && dataFromDB.length > 0){
                        cb();
                    }
                    else{
                        Service.CountryService.addCountry(dataToSave, function(err, dataFromDB){
                            if(err){
                                cb(err);
                            }
                            else{                                       
                                cb(AppConstants.STATUS_MSG.SUCCESS.CREATED);
                            }
                        })
                    }
                }
            })
        },

        function(cb){
                if(countryData.state.indexOf(dataToSave.state) == -1){
                    cb();
                }
                else{   
                    cb(AppConstants.STATUS_MSG.ERROR.STATE_EXIST);
                }
        },

        function(cb){

            countryData.state.push(dataToSave.state);

            var criteria = {
                _id: countryData._id
            };
            var setQuery = {
                $set: countryData
            };
            var options = {
                lean: true,
                new: true
            };

            Service.CountryService.update(criteria, setQuery, options, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{              
                    countryData = dataFromDB;
                    cb();
                }
            })
        }
    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, countryData);
        }
    })
}


var addOneCity = function(payloadData, callback){
    var dataToSave = payloadData;

    var countryData = {};

    var objToPush = {};

    async.series([

        function(cb){

            var criteria = {
               country: dataToSave.country
            };

            var projection = {};

            var options = {
                lean: true
            };

            Service.CountryService.findCountry(criteria, projection, options, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{
                    countryData = dataFromDB[0];
                    console.log('countryData', countryData);      
                    if(dataFromDB && dataFromDB.length > 0){
                        cb();
                    }
                    else{

                        var dataToProcess = {
                            country :  dataToSave.country,
                                state: [dataToSave.state],
                                city: [{
                                        state: dataToSave.state,
                                        cities: [dataToSave.city]
                                }] 
                            }
                        Service.CountryService.addCountry(dataToProcess, function(err, dataFromDB){
                            if(err){
                                cb(err);
                            }
                            else{                                     
                                cb(AppConstants.STATUS_MSG.SUCCESS.CREATED);
                            }
                        })
                    }
                }
            })
        },

        function(cb){
            console.log('=================', countryData.state.indexOf(dataToSave.state));
                if(countryData.state.indexOf(dataToSave.state) == -1){
                    cb();
                }
                else{   
                    if(countryData.city.length == 0 ){
                        objToPush = {
                            state: dataToSave.state,
                            cities: []
                        }
                        countryData.city.push(objToPush);
                        countryData.city[0].cities.push(dataToSave.city);
                    }
                    else{
                        var filterData = _.filter(countryData.city, {state:dataToSave.state});
                        console.log('filterData',filterData);
                        objToPush = {
                            state: dataToSave.state,
                            cities: [dataToSave.city]
                        }
                            if(filterData.length == 0){
                                countryData.city.push(objToPush);
                            }
                            else if(filterData[0].cities.indexOf(dataToSave.city) == -1){
                                    filterData[0].cities.push(dataToSave.city);
                                }
                                else{
                                    cb(AppConstants.STATUS_MSG.ERROR.CITY_EXIST);
                                }                                                    
                    }

                    var criteria = {
                        country: dataToSave.country
                    };

                     var setQuery = {
                        $set: countryData
                    };

                    var options = {
                        lean: true
                    };
                    
                    Service.CountryService.addCity(criteria, setQuery, options,  function(err, dataFromDB){
                            if(err){
                                cb(err);
                            }
                            else{                                     
                                cb(AppConstants.STATUS_MSG.SUCCESS.CREATED);
                            }
                        })
                    }
        },

        function(cb){

            countryData.state.push(dataToSave.state);
            objToPush = {
                state: dataToSave.state,
                cities: [dataToSave.city]
            }
            countryData.city.push(objToPush);

            var criteria = {
                _id: countryData._id
            };
            var setQuery = {
                $set: countryData
            };
            var options = {
                lean: true,
                new: true
            };

            Service.CountryService.update(criteria, setQuery, options, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{              
                    countryData = dataFromDB;
                    cb();
                }
            })
        }
    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, countryData);
        }
    })
}


var getAllCountries = function(queryData, callback){

    var allCoutries = [];

    async.series([
        function(cb){
            var criteria = {};

            var projection = {};

            var options = {
                lean: true,
                multi: true
            };

            Service.CountryService.findCountry(criteria, projection, options, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{
                    _.forEach(dataFromDB, function(value, key){
                        allCoutries.push(value.country);
                    })
                    cb();   
                }
            })
        },
    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, allCoutries);
        }
    })
}

var getAllStates = function(queryData, callback){

    var allStates = [];

    async.series([
        function(cb){
            var criteria = {
                country: queryData.country
            };

            var projection = {};

            var options = {
                lean: true,
                multi: true
            };

            Service.CountryService.findCountry(criteria, projection, options, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{
                    console.log('dataFromDB', dataFromDB);
                    _.forEach(dataFromDB, function(value, key){
                        allStates = value.state;
                    })
                    cb();   
                }
            })
        },
    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, allStates);
        }
    })
}

var getAllCities = function(queryData, callback){

    var filteredCitiesData = [];

    async.series([
        function(cb){
            var criteria = {
                country: queryData.country
            };

            var projection = {};

            var options = {
                lean: true,
                multi: true
            };

            Service.CountryService.findCountry(criteria, projection, options, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{
                    filteredCitiesData = _.filter(dataFromDB[0].city, {state: queryData.state});
                    if(filteredCitiesData.length == 0){
                        cb(AppConstants.STATUS_MSG.ERROR.STATE_NOT_FOUND);
                    }
                    else{
                         filteredCitiesData = filteredCitiesData[0].cities;
                         cb();
                    }                   
                    
                }
            })
        },
    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, filteredCitiesData);
        }
    })
}

module.exports = {
    addOneCountry: addOneCountry,
    addOneState: addOneState,
    addOneCity: addOneCity,
    getAllCountries: getAllCountries,
    getAllStates: getAllStates,
    getAllCities: getAllCities
}