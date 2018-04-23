var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customer_service_schema = new Schema({
        service_name: {type: String, trim: true, required: true },
        service_provider: [{
                service_provider: {type: String, trim: true }
        }]
})

module.exports = mongoose.model('CustomerServices', customer_service_schema);