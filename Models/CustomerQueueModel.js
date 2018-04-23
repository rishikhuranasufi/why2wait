var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customer_queue_schema = new Schema({
        service_name: {type: String, trim: true, required: true },
        service_provider: {type: String, trim: true, required: true },
        name: {type: String, trim: true, required: true },
        country_code: {type: String, trim: true, min:2, max:5, required: true},
        phone_number: {type: String, trim: true, min:10, max:15, required: true},
        joinedDateTime: {type: Date, default: Date.now, required: true},
        isCompleted: {type: boolean, default: false, required: true },
        waiting_time: {type: String, trim: true }
})

module.exports = mongoose.model('CustomerQueue', customer_queue_schema);