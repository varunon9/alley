/**
    * Created by: Varun kumar
    * Date: 25 april, 2016
**/
var signup = angular.module('signup', []);

signup.controller('signupController', function ($scope, $http) {
    $scope.disableSubmitButton = false;
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
    	$http(reqUserSignup).then(function successCallback (response) {
            if (response.data == 'exists') {
                $scope.disableSubmitButton = false;
                console.log('username ' + $scope.user.username + ' has been taken.');
            }
    	}, function errorCallback (response) {
            console.error('error: ' + response);
    	});
    };
});