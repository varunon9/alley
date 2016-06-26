/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var navigation = angular.module('navigation', ['ngMaterial']);

navigation.controller('navigationController', function ($rootScope, $scope, $http, $window, $mdSidenav, $window) {
    $rootScope.socket.on('connect', function () {
       console.log('connected');
    });
    $rootScope.socket.on('newUserConnected', function (user) {
        user.message = [];
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
    function checkAndRemoveUser (username) {
        for (var i in $rootScope.chatList) {
            var obj = $rootScope.chatList[i];
            if (obj.username == username) {
                if ($rootScope.userUnderChat.username == username) {
                    var messageObject = {
                        value: username + ' disconnected',
                        class: 'disconnect'
                    };
                    $rootScope.userUnderChat.message.push(messageObject);
                    delete $rootScope.userUnderChat.username;
                }
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
            var found = 0;
            for (var i = 0; i < $rootScope.chatList.length; i++) {
                if (onlineUser.username == $rootScope.chatList[i].username) {
                    found = 1;
                    break;
                }
            }
            if (found == 0) {
                onlineUser.message = [];
                $rootScope.chatList.push(onlineUser);
            }
            $scope.toggleSidenav();
        }
	};
    $scope.logout = function () {
        lsDelete('alleyUser');
        $http.get('/logout', {}).then(function successCallback (response) {
            if (response.data.message == 'success') {
                $window.location.href = '/';
            } else {
                $rootScope.alert('Some error occured. Please reload', 3000);
            }
        }, function errorCallback () {});
    };
});