/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/

var mongoApi = require('./database');
var redisApi = require('./redis');
var dl = require('delivery');

module.exports = function(ioServer, socket) {
	//console.log('A connection made by ' + socket.id);
    var delivery = dl.listen(socket);
    delivery.on('receive.success', function (file) {
        var sender = file.params.sender;
        var receiver = file.params.receiver;
        console.log('Received ' + file.name + ' from ' + sender.username + ' to ' + receiver.username);
        var callback = function (id) {
            ioServer.to(id).emit('fileFromServer', file);
        };
        var callbackValidate = function () {
            redisApi.getUserIdRedis(receiver.username, callback);
        };
        redisApi.doesUserExist(sender.username, callbackValidate);
    });
	socket.on('makeUsernameIdPair', function (user) {
		var username = user.username;
		mongoApi.updateUserStatus(username, true);
		var addCallback = function () {
            redisApi.addUserRedis(username, socket.id);
        };
		//broadcast to all other users except current only if this user is new
		var broadcastCallback = function () {
            socket.broadcast.emit('newUserConnected', user);
        };
        redisApi.broadcastIfUserIsNew(username, broadcastCallback, addCallback);
	});
	socket.on('disconnect', function() {
	    //console.log(socket.id + " disconnected");
	    var callback = function (username) {
	    	socket.broadcast.emit('userDisconnected', username);
	    	mongoApi.updateUserStatus(username, false);
	    	redisApi.deleteUsernameRedis(socket.id);
	    };
	    redisApi.getUsernameRedis(socket.id, callback);
	});
	socket.on('chatFromClient', function (sender, receiver, message) {
        var callback = function (id) {
            ioServer.to(id).emit('chatFromServer', sender, message);
        };
        var callbackValidate = function () {
            redisApi.getUserIdRedis(receiver.username, callback);
        };
        redisApi.doesUserExist(sender.username, callbackValidate);
	});
}