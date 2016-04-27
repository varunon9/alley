/**
    * Created by: Varun kumar
    * Date: 25 april, 2016
**/
var redis = require('redis');
var client = redis.createClient();

client.on('connect', function () {
    console.log('redis connected');
    //index = 11 for usernameIdPair
    var index = 11;
    module.exports = {
        addUserRedis: function (username, id) {
            client.select(index, function () {
            	client.exists(username, function (err, reply) {
            		if (reply === 1) {
            			return 'exists';
            		} else {
            			client.set(username, id);
            			return 'success';
            		}
            	});
            });
        },
        deleteUserIdRedis: function (username) {
        	client.select(index, function () {
        		client.del(username);
        	});
        },
        getUserIdRedis: function (username) {
        	client.select(index, function () {
        		client.get(username);
        	});
        } 
    };
});