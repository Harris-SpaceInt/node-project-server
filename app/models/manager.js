var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ManagerSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Manager', ManagerSchema);