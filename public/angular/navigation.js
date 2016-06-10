/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var navigation = angular.module('navigation', []);

navigation.controller('navigationController', function ($scope, $http, $window) {
    var socket = io();
    var username, user;
    //chat tabs will contain array of usernames listed as tabname 
    //and user messages
    $scope.chatTabs = [];
    $scope.typedMessage = {};
    socket.on('connect', function () {
       console.log('connected'); 
    });
    socket.on('newUserConnected', function (user) {
    	$scope.onlineUsers.push(user);
    	$scope.$apply();
    });
    socket.on('userDisconnected', function (username) {
    	$scope.onlineUsers = $scope.onlineUsers.filter(function (el) {
    		return el.username != username;
    	});
    	$scope.$apply();
    });
    socket.on('chatFromServer', function (chat) {
    	var username = chat.username;
    	var message = chat.message;
        checkAndPushMessage(username, message);
    });
    var reqUserDetails = {
    	method: 'POST',
    	url: constants.getUserDetails.url,
    	data: {},
    	header: {}
    };
    $http(reqUserDetails).then(function successCallback (response) {
    	user = response.data[0];
        if (user == undefined) {
            $window.location.href = '/signup';
        } else {
            username = user.username;
            $scope.username = username;
            if (username == null || username == '') {
                $window.location.href = '/signup';
            } else {
                socket.emit('makeUsernameIdPair', user);
            }
        }
    }, function errorCallback (response) {
    	console.log('error in getting username: ' + response);
    });
    var reqAllOnlineUsers = {
    	method: 'POST',
    	url: constants.getAllOnlineUsers.url,
    	data: {},
    	header: {}
    };
    $http(reqAllOnlineUsers).then(function successCallback (response) {
    	$scope.onlineUsers = response.data;
    	console.log($scope.onlineUsers);
    }, function errorCallback (response) {
    	console.log('error in getting allOnlineUsers: ' + response);
    });
    $scope.connect = function (index) {
    	$scope.chatTabs.push($scope.onlineUsers[index].username);
    };
    $scope.disconnect = function (index) {
    	$scope.chatTabs.splice(index, 1);
    };
    $scope.sendMessage = function (index) {
    	var message = $scope.typedMessage.value;
    	$scope.typedMessage.value = '';
    	var username = $scope.chatTabs[index];
    	var chat = {
    		'username': username,
    		'message': message
    	};
    	socket.emit('chatFromClient', chat);
    	var temp = username + 'Messages';
    	var para = '<p class="client">' + message + '</p>';
    	$scope[temp] = $scope[temp] || [];
    	$scope[temp].push(para);
    };
    function checkAndPushMessage (username, message) {
        message = "<span class='server'>" + message + "</span>";
        var found = 0;
        for (i in $scope.chatTabs) {
            var obj = $scope.chatTabs[i];
            if (obj.username == username) {
                found = 1;
                obj.message.push(message);
                break;
            }
        }
        if (found == 0) {
            var tempObject = {};
            tempObject.username = username;
            tempObject.message = [];
            tempObject.message.push(message);
            $scope.chatTabs.push(tempObject);
        }
    }
});