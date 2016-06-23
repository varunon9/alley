/**
    * Created by: Varun kumar
    * Date: 25 april, 2016
**/

var constants = {
    userSignup: {
    	url: '/user/signup'
    },
    getUserDetails: {
    	url: '/getUserDetails'
    },
    getAllOnlineUsers: {
    	url: '/getAllOnlineUsers'
    }
};

//localStorage library
var hasStorage = function () {
    try {
        localStorage.setItem('testing', 'alley');
        localStorage.removeItem('testing');
        return true;
    } catch (exception) {
        return false;
    }
};
var lsGet = function (key) {
    if (hasStorage()) {
        var jsonString = localStorage.getItem(key);
        try {
            var json = JSON.parse(jsonString);
        } catch (exception) {
            return jsonString;
        }
        return json;
    }
    return;
};
var lsSet = function (key, object) {
    if (hasStorage()) {
        if (typeof object == 'object') {
            var jsonString = JSON.stringify(object);
            localStorage.setItem(key, jsonString);
        } else {
            localStorage.setItem(key, object);
        }
    }
};
var lsDelete = function (key) {
    localStorage.removeItem(key);
};
var lsUpdate = function (key, object) {
    if (hasStorage()) {
        var jsonString = localStorage.getItem(key);
        var jsonObject = JSON.parse(jsonString);
        Object.keys(updatedObject).forEach(function (jsonKey) {
            jsonObject[jsonKey] = updatedObject[jsonKey];
        });
        localStorage.setItem(key, JSON.stringify(jsonObject));
    }
}