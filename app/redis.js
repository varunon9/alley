/**
    * Created by: Varun kumar
    * Date: 25 april, 2016
**/
var redis = require('redis');
var client = redis.createClient();

client.on('connect', function () {
    console.log('redis connected');
});
//index = 15 for usernameIdPair
var index = 15;
var redisApi = {
	addUserRedis: function (username, id) {
		client.select(index, function () {
			client.set(username, id);
			client.set(id, username);
		});
	},
	deleteUserIdRedis: function (username) {
		client.select(index, function () {
			client.get(username, function (err, id) {
				client.del(id);
				client.del(username);
			});
		});
	},
	deleteUsernameRedis: function (id) {
		client.select(index, function () {
			client.get(id, function (err, username) {
				client.del(username);
				client.del(id);
			});
		});
	},
	getUserIdRedis: function (username, callback) {
		client.select(index, function () {
			client.get(username, function (err, id) {
				callback(id);
			});
		});
	},
	getUsernameRedis: function (id, callback) {
		client.select(index, function () {
			client.get(id, function (err, username) {
				callback(username);
			});
		});
	},
	doesUserExist: function (username, callback) {
        client.select(index, function () {
            client.get(username, function (err, id) {
                if (id) {
                    callback ();
                } else {
                    
                }
            });
        });
    },
    broadcastIfUserIsNew: function (username, broadcastCallback, addCallback) {
        client.select(index, function () {
            client.get(username, function (err, id) {
                if (id) {
                } else {
                    broadcastCallback();
                }
                addCallback();
            });
        });
    }
};
module.exports = redisApi;