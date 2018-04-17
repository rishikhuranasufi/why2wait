var Joi = require('joi');
var async = require('async');
var appSchema = require('../Routes/AppSchema');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Service = require('../Services');
var AppConstants = require('../Config/appConstants');

var _ = require('lodash');

var addService = function(payloadData, callback){
    console.log("payloadData ",payloadData);
    var dataToSave = payloadData;
    var serviceData;

    async.series([
        function(cb){
            
            var criteria = {
                service_name: dataToSave.service_name
            };
            var projection = {};

            var options = {
                lean: true
            };

            Service.CustomerService.getService(criteria, projection, options, function(err, dataFromDB){
                 if(err){
                    cb(err);
                }
                else if(dataFromDB && dataFromDB.length > 0){
                    cb(AppConstants.STATUS_MSG.ERROR.SERVICE_ALREADY_EXIST);
                    }
                    else{
                        cb();
                    }
                    
                })

        },
        function(cb){

            Service.CustomerService.addService(dataToSave, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{
                    serviceData = dataFromDB;
                    cb();
                }
            })
        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, serviceData);
        }
    })
}

var addServiceProvider = function(payloadData, callback){
    console.log("payloadData ",payloadData);
    var dataToSave = payloadData;
    var serviceData;

    async.series([

        function(cb){
            
            var criteria = {
                service_name: dataToSave.service_name,
                service_provider: dataToSave.service_provider
            };
            var projection = {};

            var options = {
                lean: true
            };

            Service.CustomerService.getService(criteria, projection, options, function(err, dataFromDB){
                 if(err){
                    cb(err);
                }
                else if(dataFromDB && dataFromDB.length > 0){
                    cb(AppConstants.STATUS_MSG.ERROR.PROVIDER_ALREADY_EXIST);
                    }
                    else{
                        cb();
                    }
                    
                })

        },

        function(cb){
            
            var criteria = {
                service_name: dataToSave.service_name
            };
            var projection = {};

            var options = {
                lean: true
            };

            Service.CustomerService.getService(criteria, projection, options, function(err, dataFromDB){
                 if(err){
                    cb(err);
                }
                else if(dataFromDB && dataFromDB.length > 0){
                    console.log('dataFromDB', dataFromDB);
                    dataToSet = dataFromDB[0];
                    dataToSet.service_provider.push(dataToSave.service_provider);

                    console.log('dataToSet', dataToSet);

                    var criteria1 = {
                        service_name: dataToSet.service_name
                    };
                    var setQuery1 = {
                        $set: dataToSet
                    };
                    var options1 = {
                        lean: true,
                        new: true
                    };

                    Service.CustomerService.updateService(criteria1, setQuery1, options1, function(err, data){
                        if(err){
                            cb(err);
                        }
                        else{
                            serviceData = data;
                            cb();
                        }
                    })
                }  
                })
        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, serviceData);
        }
    })
}

var getAllServices = function(payloadData, callback){
    console.log("payloadData ",payloadData);
    var dataToSave = payloadData;
    var allServices = [];
    async.series([
        function(cb){
            
            var criteria = {};
            var projection = {};

            var options = {
                lean: true
            };

            Service.CustomerService.getService(criteria, projection, options, function(err, dataFromDB){
                 if(err){
                    cb(err);
                }
                else if(dataFromDB && dataFromDB.length > 0){
                        console.log('dataFromDB',dataFromDB);
                        _.forEach(dataFromDB, function(value, key){
                            allServices.push(value.service_name);
                        })
                        cb();
                    }
                    else{
                        cb(AppConstants.STATUS_MSG.ERROR.NOT_FOUND);
                    }            
                })
        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, allServices);
        }
    })
}

module.exports = {
    addService: addService,
    addServiceProvider: addServiceProvider,
    getAllServices: getAllServices
}