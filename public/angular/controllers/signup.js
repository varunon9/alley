/**
    * Created by: Varun kumar
    * Date: 25 april, 2016
    * Hire me. Contact: varunon9@gmail.com
**/
var signup = angular.module('signup', ['ngMaterial']);

signup.controller('signupController', function ($scope, $http, $window, $rootScope, $location) {
	$scope.signupUser = {
		username: '',
		age: '',
		gender: 'male'
	};
    $scope.disableSubmitButton = false;
    var reqUserSignup = {
    	method: 'POST',
    	url: constants.userSignup.url,
    	headers: {},
    	data: {}
    };
    $scope.userSignup = function () {
		if ($scope.signupUser.username =='' || $scope.signupUser.age == '' || $scope.signupUser.username == undefined || $scope.signupUser.age == undefined) {
			$rootScope.alert('Please fill all the details correctly', 3000);
			return;
		}
		if ($scope.signupUser.username == $rootScope.alleyBot.username) {
			$rootScope.alert('Please choose a different username.', 3000);
			return;
		}
        $scope.disableSubmitButton = true;
    	reqUserSignup.data.user = $scope.signupUser;
    	$http(reqUserSignup).then(function successCallback (response) {
            if (response.data == 'exists') {
                $scope.disableSubmitButton = false;
				$rootScope.alert('username ' + $scope.signupUser.username + ' has been taken.', 3000);
            } else if (response.data == 'success') {
				$rootScope.socket.emit('makeUsernameIdPair', $scope.signupUser);
                $rootScope.alert('Success', 3000);
				$rootScope.user = $scope.signupUser;
                $location.path('/chat');
            } else {
                console.log(response.data);
                $scope.disableSubmitButton = false; 
            }
    	}, function errorCallback (response) {
			$rootScope.alert('Error Occured', 3000);
            console.error('error: ' + response);
    	});
    };
});