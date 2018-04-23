// Npm modules
var http = require('http');
var express = require('express');
var BodyParser = require('body-parser');

var app = express();
app.use(BodyParser.json());
var Bootstrap = require('./Utils/BootStrap');
var appSchema = require('./Routes/AppSchema');
var validate = require('express-validation');
var Config = require('./Config/dbConfig');
var AppConstants = require('./Config/appConstants');
var Controller = require('./Controllers');
var UniversalFunctions = require('./Utils/UniversalFunctions');

// Server root
app.get('/', function(req, res) {
    res.send('Hello Node Base');
});

// Client Api's
app.post('/api/client/register', validate(appSchema.register_client_schema), function(req, res){
    Controller.ClientController.registerClient(req.body, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.json(data);
        }
    })
});

app.post('/api/client/login', validate(appSchema.login_client_schema), function(req, res){
    Controller.ClientController.loginClient(req.body, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.LOGIN,data));
        }
    })
});

app.post('/api/client/update', validate(appSchema.update_client_schema), function(req, res){
    Controller.ClientController.updateClient(req, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.UPDATED, data));
        }
    })
});

app.delete('/api/client/deleteClient', validate(appSchema.delete_client_schema), function(req, res){
    Controller.ClientController.deleteClient(req, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.json(data);
        }
    })
});

app.post('/api/client/logout', validate(appSchema.logout_client_schema), function(req, res){
    Controller.ClientController.logoutClient(req, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.LOGOUT));
        }
    })
});

app.get('/api/client/getAllClients', function(req, res){
    Controller.ClientController.getAllClients(req, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.DEFAULT,data));
        }
    })
});

// Customer Services

app.post('/api/customer/addService', validate(appSchema.add_customer_service_schema), function(req, res){
    Controller.CustomerController.addService(req.body, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.DEFAULT));
        }
    })
});

app.post('/api/customer/addServiceProvider', validate(appSchema.add_service_provider_schema), function(req, res){
    Controller.CustomerController.addServiceProvider(req.body, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.DEFAULT));
        }
    })
});


app.get('/api/customer/getAllServices', function(req, res){
    Controller.CustomerController.getAllServices(req.body, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.DEFAULT,data));
        }
    })
});

app.get('/api/customer/getAllServiceProviders', validate(appSchema.get_service_provider_schema), function(req, res){
    Controller.CustomerController.getAllServiceProviders(req.query, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.DEFAULT,data));
        }
    })
});

app.post('/api/customer/joinQueue', validate(appSchema.join_queue_schema), function(req, res){
    Controller.CustomerController.joinQueue(req.body, function(err, data){
        if(err){
            res.json(err);
        }
        else{
            res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.SUCCESS.DEFAULT,data));
        }
    })
});


// console.log("environment variable ===", process.env.PATH);
console.log("environment variable MONGO_USER ===", process.env.TEMP);



// Example error handler
app.use(function (err, req, res, next) {
    if (err) {
        console.log('err========', err);
        if(err.type == 'entity.parse.failed'){
             res.send(UniversalFunctions.sendSuccess(AppConstants.STATUS_MSG.ERROR.INVALID_REQUEST));
        }
        var customErrorMessage = err.errors[0].messages;
        console.log('customErrorMessage', customErrorMessage);
        customErrorMessage = customErrorMessage[0];
        customErrorMessage = customErrorMessage.replace(/"/g, '');
        customErrorMessage = customErrorMessage.replace('[', '');
        customErrorMessage = customErrorMessage.replace(']', '');
        var response = {
            "message": customErrorMessage,
            "status": err.status,
            "data": {}
        }
        return res.status(response.status).send(response);
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    
});

http.createServer(app).listen(Config.express.port, function () {
        console.log('Server started at port: ', Config.express.port);
});