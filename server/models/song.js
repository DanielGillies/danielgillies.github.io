
var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
	file : String,
	title : String,
	channel : String,
    description : String, 
    thumbnail : String,
    timestamp : Number
})

module.exports = mongoose.model('Song', songSchema)