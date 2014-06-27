var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    owner: String,
    data: String
    
});

module.exports = mongoose.model('Game', Game);