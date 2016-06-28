var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    title: String,
    generated: Boolean,
    discipline: [String],
    summary: String,
    team: String,
    image: {type: String, default: null},
    savings: Number,
    hours: Number,
    day: Number,
    month: Number,
    year: Number,
    manager: {
        name: String,
        unit: String,
        function: String,
        department: String,
        phone: String,
        email: String
    },
    result: [{
        summary: String,
        details: String,
        savings: Number,
        hours: Number
    }]
});

module.exports = mongoose.model('Project', ProjectSchema);

/*generated: Boolean,
 discipline: [String],
 summary: String,
 team: String,
 image: {type: String, default: null},
 savings: Number,
 hours: Number,
 day: Number,
 month: Number,
 year: Number,
 manager: {
 name: String
 },
 result: [{

 }]*/