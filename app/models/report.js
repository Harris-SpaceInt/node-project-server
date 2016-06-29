var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
    day: Number,
    month: Number,
    year: Number,
    project: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

module.exports = mongoose.model('Report', ReportSchema);
