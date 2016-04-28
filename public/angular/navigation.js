/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var navigation = angular.module('navigation', []);

navigation.controller('navigationController', function ($scope, $http, $window) {
    var socket = io();
    var username;
    socket.on('connect', function () {
       console.log('connected'); 
    });
    var reqUsername = {
    	method: 'POST',
    	url: constants.getUsername.url,
    	data: {},
    	header: {}
    };
    $http(reqUsername).then(function successCallback(response) {
    	username = response.data;
    	if (username == null || username == '') {
    		$window.location.href = '/signup';
    	} else {
    		console.log(username);
    		socket.emit('makeUsernameIdPair', username);
    	}
    }, function errorCallback(response) {
    	console.log('error in getting username');
    	console.log(response);
    });
});