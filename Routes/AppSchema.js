var Joi = require('joi');
var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var countryCodeRegExp = /^(\+?\d{1,3}|\d{1,4})$/;
var phoneNumberRegExp =/^\d{10}$/;

exports.register_client_schema = {
    body:{
        name: Joi.string().required().min(3),
        email: Joi.string().regex(emailRegExp).required(),
        password: Joi.string().required().min(6),
        country_code: Joi.string().regex(countryCodeRegExp).required(),
        phone_number: Joi.string().regex(phoneNumberRegExp).required(),
        address: Joi.string().optional()
    }
}

exports.login_client_schema = {
    body: {
        email: Joi.string().regex(emailRegExp).required(),
        password: Joi.string().required().min(6)
    }
}

exports.update_client_schema = {
    body: {
        name: Joi.string().required(),
        email: Joi.string().regex(emailRegExp).required(),
        country_code: Joi.string().required(),
        phone_number: Joi.string().required(),
        address: Joi.string().optional()
    },
    headers: {
        authorization: Joi.string().required()
    }
}

exports.get_all_client_schema = {
    headers: {
        authorization: Joi.string().required()
    }
}

exports.delete_client_schema = {
    query: {
        _id: Joi.string().required()
    },
    headers: {
        authorization: Joi.string().required()
    }
}

exports.logout_client_schema = {
    headers: {
        authorization: Joi.string().required()
    }
}

exports.add_customer_service_schema = {
    body: {
        service_name: Joi.string().required()
    }
}

exports.add_service_provider_schema = {
    body: {
        service_name: Joi.string().required(),
        service_provider: Joi.string().required()
    }
}