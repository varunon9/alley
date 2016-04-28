/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/

var mongoApi = require('./database');
var redisApi = require('./redis');

module.exports = function(ioServer, socket) {
	console.log('A connection made by ' + socket.id);
	socket.on('makeUsernameIdPair', function (username) {
		redisApi.addUserRedis(username, socket.id);
	});
	socket.on('disconnect', function() {
	    console.log(socket.id + " disconnected");
	    redisApi.deleteUsernameRedis(socket.id);
	});
}