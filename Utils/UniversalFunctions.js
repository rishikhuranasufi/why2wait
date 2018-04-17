var MD5 = require('md5');
var statusMessage = require('../Config/appConstants');

var getErrorMessage = function(req, callback){
    if(req[0].type == "any.required"){
        if(req[0].context.key == 'name'){
            callback(null, statusMessage.STATUS_MSG.REQUIRED.NAME_REQUIRED);
        }
        if(req[0].context.key == 'email'){
            callback(null, statusMessage.STATUS_MSG.REQUIRED.EMAIL_REQUIRED);
        }
        if(req[0].context.key == 'password'){
            callback(null, statusMessage.STATUS_MSG.REQUIRED.PASSWORD_REQUIRED);
        }
        if(req[0].context.key == 'country_code'){
            callback(null, statusMessage.STATUS_MSG.REQUIRED.COUNTRY_CODE_REQUIRED);
        }
        if(req[0].context.key == 'phone_number'){
            callback(null, statusMessage.STATUS_MSG.REQUIRED.PHONE_REQUIRED);
        }
    }
    else if(req[0].type == "string.min"){
        if(req[0].context.key == 'password'){
            callback(null, statusMessage.STATUS_MSG.ERROR.SHORT_PASSWORD);
        }
    }
    
}


var CryptData = function (stringToCrypt) {
    return MD5(MD5(stringToCrypt));
};

var sendSuccess = function (successMsg, data) {
    successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode:successMsg.statusCode, message: successMsg.customMessage, data: data || null};

    }else {
        return {statusCode:200, message: successMsg, data: data || null};

    }
};

module.exports = {
    getErrorMessage: getErrorMessage,
    CryptData: CryptData,
    sendSuccess: sendSuccess
}