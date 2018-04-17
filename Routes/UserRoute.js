var Joi = require('joi');
var async = require('async');
var Controller = require('../Controllers');
var appSchema = require('../Routes/AppSchema');
var universalFunctions = require('../Utils/UniversalFunctions');
var validate = require('express-validation');

var registerUserRoute = function(req, res){
    req.validate(appSchema.register_user_schema, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            Controller.UserController.registerUser(req.body, function(err, data){
                if(err){
                    res.json(err);
                }
                else{
                    res.json(data);
                }
            })
        }
    })
}

module.exports = {
    registerUserRoute: registerUserRoute
}