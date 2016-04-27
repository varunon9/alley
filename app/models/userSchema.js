/**
    * Created by: Varun kumar
    * Date: 26 april, 2016
**/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/alley');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    gender: {type: String, required: true},
    status: {type: Boolean, required: true}
});
var User = mongoose.model('User', userSchema);

module.exports = User;