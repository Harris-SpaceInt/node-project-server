var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    title: String
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