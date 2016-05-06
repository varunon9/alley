/**
    * Created by: Varun kumar
    * Date: 26 april, 2016
**/

var User = require('./models/userSchema');

var mongoApi = {
	addUser: function (user, errorCallback, successCallback) {
		var newUser = new User({
			username: user.username,
			age: user.age,
			gender: user.gender,
			status: true
		});
		console.log(newUser);
		User.find({username: user.username}, function (err, user) {
			if (err) {
				throw err;
			}
			if (user.length > 0) {
				errorCallback();
			} else {
				newUser.save(function (err) {
					if (err) {
						console.log(err.name);
						throw err;
					}
					console.log('user ' + newUser.username + ' added');
					successCallback();
				});
			}
		});
	},
	getUser: function (username, callback) {
		User.find({username: username}, function (err, user) {
			if (err) {
				console.log(err.name);
				throw err;
			}
			callback(user);
		});
	},
	deleteUser: function (username, successCallback) {
		User.findOneAndRemove({username: username}, function (err) {
			if (err) {
				console.log(err.name);
				throw err;
			}
			console.log('user ' + username + ' deleted');
			successCallback();
		});
	},
	updateUserStatus: function (username, status) {
		User.findOneAndUpdate(
		    {username: username},
		    {status: status},
		    function (err, user) {
		    	if (err) {
		    		console.log(err.name);
		    		throw err;
		    	}
		    }
		);
	},
	getAllUsers: function (callback) {
		User.find({}, function (err, users) {
			if (err) {
				console.log(err.name);
				throw err;
			}
			callback(users);
		});
	},
	getAllOnlineUsers: function (callback) {
	    User.find({status: true}, function (err, onlineUsers) {
	    	if (err) {
	    		console.log(err.name);
	    		throw err;
	    	}
	    	callback(onlineUsers);
	    });
	},
	getCountOfOnlineUsers: function (callback) {
		User.count({status: true}, function (err, count) {
			if (err) {
	    		console.log(err.name);
	    		throw err;
	    	}
	    	callback(count);
		});
	}
};
module.exports = mongoApi;