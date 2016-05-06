/**
    * Created by: Varun kumar
    * Date: 6 may, 2016
**/
var about = angular.module('about', []);

about.controller('aboutController', function ($scope, $http, $window) {
    $scope.onlineUsers = 0;
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