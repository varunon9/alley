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
		User.find({username: user.username}, function (err, user) {
			if (err) {
				throw err;
			}
			if (user.length > 0) {
				errorCallback();
			} else {
				newUser.save(function (err) {
					if (err) {
						throw err;
					}
					console.log('user ' + newUser.username + ' added');
					successCallback();
				});
			}
		});
	},
	getUser: function (username) {
		User.find({username: username}, function (err, user) {
			if (err) {
				throw err;
			}
			return user;
		});
	},
	deleteUser: function (username, successCallback) {
		User.findOneAndRemove({username: username}, function (err) {
			if (err) {
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
		    		throw err;
		    	}
		    	console.log('status updated ' + user.status);
		    }
		);
	},
	getAllUsers: function () {
		User.find({}, function (err, users) {
			if (err) {
				throw err;
			}
			return users;
		});
	},
	getAllOnlineUsers: function () {
	    User.find({status: true}, function (err, onlineUsers) {
	    	if (err) {
	    		throw err;
	    	}
	    	return onlineUsers;
	    });
	}
};
module.exports = mongoApi;