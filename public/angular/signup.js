/**
    * Created by: Varun kumar
    * Date: 25 april, 2016
**/
var signup = angular.module('signup', []);

signup.controller('signupController', function ($scope, $http, $window) {
    $scope.disableSubmitButton = false;
    $scope.onlineUsers = 0;
	$scope.user = {
		username: '',
		age: '',
		gender: 'male'
	};
    var reqUserSignup = {
    	method: 'POST',
    	url: constants.userSignup.url,
    	headers: {},
    	data: {}
    };
    $scope.userSignup = function () {
        $scope.disableSubmitButton = true;
    	reqUserSignup.data.user = $scope.user;
        console.log($scope.user);
    	$http(reqUserSignup).then(function successCallback (response) {
            if (response.data == 'exists') {
                $scope.disableSubmitButton = false;
                console.log('username ' + $scope.user.username + ' has been taken.');
            } else {
                console.log('success');
                $window.location.href = '/';
            }
    	}, function errorCallback (response) {
            console.error('error: ' + response);
    	});
    };
    var reqGetCountOfOnlineUsers = {
        method: 'POST',
        url: constants.getCountOfOnlineUsers.url,
        headers: {},
        data: {}
    };
    $http(reqGetCountOfOnlineUsers).then(function successCallback (response) {
        $scope.onlineUsers = response.data.count;
    }, function errorCallback (response) {
            console.error('error: ' + response);
    });
});