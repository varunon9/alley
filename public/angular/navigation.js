/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var navigation = angular.module('navigation', []);

navigation.controller('navigationController', function ($scope, $http, $window) {
    var socket = io();
    var username, user;
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
    var reqUserDetails = {
    	method: 'POST',
    	url: constants.getUserDetails.url,
    	data: {},
    	header: {}
    };
    $http(reqUserDetails).then(function successCallback (response) {
    	user = response.data[0];
    	username = user.username;
    	$scope.username = username;
    	if (username == null || username == '') {
    		$window.location.href = '/signup';
    	} else {
    		socket.emit('makeUsernameIdPair', user);
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
    	//console.log($scope.onlineUsers[index]);
    };
});