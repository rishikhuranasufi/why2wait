var Joi = require('joi');
var async = require('async');
var appSchema = require('../Routes/AppSchema');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Service = require('../Services');
var AppConstants = require('../Config/appConstants');

var registerClient = function(payloadData, callback){
    console.log("payloadData ",payloadData);
    var dataToSave = payloadData;
    if(dataToSave.password){
        dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
    }

    var userData = null;

    async.series([
        function(cb){
            var criteria = {
                email: dataToSave.email
            };
            var projection = {};

            var options = {
                lean: true
            };

            Service.ClientService.getClient(criteria, projection, options, function(err, dataFromDB){
                 if(err){
                    cb(err);
                }
                else if(dataFromDB && dataFromDB.length > 0){
                    cb(AppConstants.STATUS_MSG.ERROR.EMAIL_EXIST);
                    }
                    else{
                        cb();
                    }
                    
                })

        },
        function(cb){
            var accessToken = UniversalFunctions.CryptData(dataToSave.email + new Date().getTime());
            dataToSave.registrationDate = new Date().toISOString();
            dataToSave.accessToken = accessToken;

            Service.ClientService.createClient(dataToSave, function(err, dataFromDB){
                if(err){
                    cb(err);
                }
                else{
                    userData = dataFromDB;
                    cb();
                }
            })
        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, userData);
        }
    })
}

var updateClient = function(payloadData, callback){
    console.log("payloadData1 ",payloadData);
    var dataToSave = payloadData.body;
    var userData = null;

    async.series([

        function(cb){

            var criteria = {
                accessToken: payloadData.headers.authorization
            };

            var projection = {};

            var options = {
                lean: true
            };

            Service.ClientService.getClient(criteria, projection, options, function(err, dataFromDB){
                 if(err){
                    cb(err);
                }
                else if(dataFromDB && dataFromDB.length > 0){
                    userData = dataFromDB[0];
                    cb();
                    }
                    else{
                        cb(AppConstants.STATUS_MSG.ERROR.INVALID_TOKEN);
                    }
                    
                })
        },

        function(cb){

            dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);

            if(userData.email == dataToSave.email){
                cb();
            }
            else{
                cb(AppConstants.STATUS_MSG.ERROR.INVALID_EMAIL_UPDATE);
            }
        },

        function(cb){

            var criteria = {
                email: dataToSave.email
            };
            var setQuery = {
                $set: dataToSave
            };
            var options = {
                lean: true,
                new: true
            };

            Service.ClientService.updateClient(criteria, setQuery, options, function(err, data){
                if(err){
                    cb(err);
                }
                else{
                    userData = data;
                    cb();
                }
            })
        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, userData);
        }
    })
}

var getAllClients = function(payloadData, callback){
    console.log("Get Query ",payloadData);
    var dataToSave = payloadData.query;
    var userData;
    async.series([

        function(cb){

            var criteria = {};
            var setQuery = {
                accessToken: 0
            };
            var options = {
                multi: true
            };

            Service.ClientService.getClient(criteria, setQuery, options, function(err, data){
                if(err){
                    cb(err);
                }
                else{
                    userData = data;
                    cb();
                }
            })
        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, userData);
        }
    })
}

var deleteClient = function(payloadData, callback){
    var dataToSave = payloadData.query;

    async.series([
        function(cb){

            var criteria = {
                accessToken: payloadData.headers.authorization
            };

            var projection = {};

            var options = {
                lean: true
            };

            Service.ClientService.getClient(criteria, projection, options, function(err, dataFromDB){
                 if(err){
                    cb(err);
                }
                else if(dataFromDB && dataFromDB.length > 0){
                    cb();
                    }
                    else{
                        cb(AppConstants.STATUS_MSG.ERROR.UNAUTHORIZED);
                    }
                    
                })
        },

        function(cb){

            var criteria = {
                _id: payloadData.query._id
            };

            var projection = {};

            var options = {
                lean: true
            };

            Service.ClientService.getClient(criteria, projection, options, function(err, dataFromDB){
                 if(err){
                    cb({
                        "statusCode": 401,
                        "message": "Invalid ID Provided.",
                        "data":    {}
                    });
                }
                else if(dataFromDB && dataFromDB.length > 0){
                    console.log('dataFromDB', dataFromDB);
                    cb();
                    }
                    else{
                        cb(AppConstants.STATUS_MSG.ERROR.INVALID_ID);
                    }
                    
                })
        },

        function(cb){

            var criteria = {
                _id: dataToSave._id
            };

            Service.ClientService.deleteUser(criteria, function(err, data){
                if(err){
                    cb(err);
                }
                else{
                    userData = data;
                    cb();
                }
            })
        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, AppConstants.STATUS_MSG.SUCCESS.DELETED);
        }
    })
}

var loginClient = function(payloadData, callback){
    console.log("POST BODY DATA ",payloadData);
    var dataToSave = payloadData;

    if(dataToSave.password){
        dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
    }

    var loginUserData = {};

    async.series([
        function(cb){

            var criteria = {
               email: dataToSave.email
            };

            var projection = {};

            var options = {
                lean: true
            };

            Service.ClientService.getClient(criteria, projection, options, function(err, data){
                 if(err){
                    cb(err);
                }
                else if(data && data.length > 0){
                    loginUserData = data[0];
                    console.log('loginUserData', loginUserData);
                    cb();
                    }
                    else{
                        cb(AppConstants.STATUS_MSG.ERROR.EMAIL_NOT_FOUND);
                    }
                    
                })
        },

        function(cb){
            if(loginUserData.password == dataToSave.password){
                cb();
            }
            else{
                cb(AppConstants.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
            }
            
        },

        function(cb){

            var accessToken = UniversalFunctions.CryptData(dataToSave.email + new Date().getTime());
            var criteria = {
                _id: loginUserData._id
            };
            var setQuery = {
                $set: {accessToken: accessToken}
            };
            var options = {
                lean: true,
                new: true
            };

            Service.ClientService.updateClient(criteria, setQuery, options, function(err, data){
                if(err){
                    cb(err);
                }
                else{
                    loginUserData = data;
                    cb();
                }
            })

        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, loginUserData);
        }
    })
}

var logoutClient = function(payloadData, callback){
    var dataToSave = payloadData.headers;

    var loginUserData = {};

    async.series([
        function(cb){

            var criteria = {
               accessToken: dataToSave.authorization
            };

            var projection = {};

            var options = {
                lean: true
            };

            Service.ClientService.getClient(criteria, projection, options, function(err, data){
                 if(err){
                    cb(err);
                }
                else if(data && data.length > 0){
                    loginUserData = data[0];
                    cb();
                    }
                    else{
                        cb(AppConstants.STATUS_MSG.ERROR.INVALID_TOKEN);
                    }
                    
                })
        },

        function(cb){

            var criteria = {
                accessToken: loginUserData.accessToken
            };
            var setQuery = {
                $set: {accessToken: 1}
            };
            var options = {
                lean: true,
                new: true
            };

            Service.ClientService.updateClient(criteria, setQuery, options, function(err, data){
                if(err){
                    cb(err);
                }
                else{
                    loginUserData = data;
                    cb();
                }
            })

        }

    ], function(err, success){
        if(err) {
            callback(err);
        } else {
            callback(null, loginUserData);
        }
    })
}

module.exports = {
    registerClient: registerClient,
    updateClient: updateClient,
    getAllClients: getAllClients,
    deleteClient: deleteClient,
    loginClient: loginClient,
    logoutClient: logoutClient
}