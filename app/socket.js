/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/

var mongoApi = require('./database');
var redisApi = require('./redis');

module.exports = function(ioServer, socket) {
	console.log('A connection made by ' + socket.id);
	socket.on('makeUsernameIdPair', function (user) {
		var username = user.username;
		mongoApi.updateUserStatus(username, true);
		redisApi.addUserRedis(username, socket.id);
		//broadcast to all other users except current
		socket.broadcast.emit('newUserConnected', user);
	});
	socket.on('disconnect', function() {
	    console.log(socket.id + " disconnected");
	    var callback = function (username) {
	    	socket.broadcast.emit('userDisconnected', username);
	    	mongoApi.updateUserStatus(username, false);
	    	redisApi.deleteUsernameRedis(socket.id);
	    };
	    redisApi.getUsernameRedis(socket.id, callback);
	});
}