var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    title: String,
    generated: {
        type: Boolean,
        default: false
    },
    discipline: [{
        type: String,
        enum: [
            'Software', 
            'Systems', 
            'Electrical', 
            'Mechanical', 
            'Production', 
            'Integration and Test', 
            'Corportate', 
            'Program Management'
        ]
    }],
    summary: String,
    team: String,
    image: {
        type: String, 
        default: null
    },
    savings: Number,
    hours: Number,
    day: Number,
    month: Number,
    year: Number,
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
    },
    result: [{
        summary: String,
        details: String,
        savings: Number,
        hours: Number
    }]
});

module.exports = mongoose.model('Project', ProjectSchema);
