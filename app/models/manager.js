var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ManagerSchema = new Schema({
    name: String,
    unit: String,
    function: String,
    department: String,
    phone: String,
    email: String
});

module.exports = mongoose.model('Manager', ManagerSchema);
