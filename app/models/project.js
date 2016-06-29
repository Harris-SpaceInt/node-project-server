var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    title: String,
    generated: Boolean,
<<<<<<< HEAD
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
=======
    discipline: [String],
    summary: String,
    team: String,
    image: {type: String, default: null},
>>>>>>> e7caa7811b7a87f88929e4ff103f39a11476747f
    savings: Number,
    hours: Number,
    day: Number,
    month: Number,
    year: Number,
    manager: {
<<<<<<< HEAD
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
=======
        name: String,
        unit: String,
        function: String,
        department: String,
        phone: String,
        email: String
>>>>>>> e7caa7811b7a87f88929e4ff103f39a11476747f
    },
    result: [{
        summary: String,
        details: String,
        savings: Number,
        hours: Number
    }]
});

module.exports = mongoose.model('Project', ProjectSchema);
