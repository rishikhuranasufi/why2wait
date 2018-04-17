var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var country_schema = new Schema({
        country :  {type: String, trim: true, min:2, required: true, unique: true},
        state: [{type: String, trim: true, min:2}],
        city: [{
                state: {type: String, trim: true, min:2},
                cities: [{type: String, trim: true, min:2}]
        }]      
})

module.exports = mongoose.model('Country', country_schema);