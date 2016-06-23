/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var navigation = angular.module('navigation', ['ngMaterial']);

navigation.controller('navigationController', function ($rootScope, $scope, $http, $window, $mdSidenav, $mdToast) {
    $rootScope.socket.on('connect', function () {
       console.log('connected');
    });
    $rootScope.socket.on('newUserConnected', function (user) {
    	$scope.onlineUsers.push(user);
    	$scope.$apply();
    });
    $rootScope.socket.on('userDisconnected', function (username) {
    	$scope.onlineUsers = $scope.onlineUsers.filter(function (el) {
    		return el.username != username;
    	});
    	$scope.$apply();
        checkAndRemoveUser(username);
    });
    function checkAndRemoveUser (username) {console.log(username, 'remove from chatlist');
        for (var i in $rootScope.chatList) {
            var obj = $rootScope.chatList[i];
            if (obj.username == username) {
                $rootScope.chatList.splice(i, 1);
                $scope.$apply();
                break;
            }
        }
    }
    $scope.onlineUsers = [];
    $http.post(constants.getAllOnlineUsers.url, {}).then(function successCallback (response) {
        $scope.onlineUsers = response.data;
    }, function errorCallback (response) {
        console.log('error in getting allOnlineUsers: ' + response);
    });
    $scope.toggleSidenav = function () {
        $mdSidenav('leftSidenav').toggle();
    };
    $scope.chatToOnlineUser = function (onlineUser) {
		if ($rootScope.user.username == undefined || $rootScope.user.username == 'Guest') {
			$rootScope.alert('Please Signup First', 3000);
		} else {
            $rootScope.chatList.push(onlineUser);
            $scope.toggleSidenav();
        }
	};
});