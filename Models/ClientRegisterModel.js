var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var register_client_schema = new Schema({
        name: {type: String, trim: true, required: true },
        email: {type: String, trim: true, required: true, unique: true, index:true },
        password: {type:String},
        country_code: {type: String, trim: true, min:2, max:5, required: true},
        phone_number: {type: String, trim: true, min:10, max:15, required: true},
        address: {type: String},
        registrationDate: {type: Date, default: Date.now, required: true},
        accessToken:{type: String, trim: true}
})

module.exports = mongoose.model('Clients', register_client_schema);