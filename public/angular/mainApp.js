/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var mainApp = angular.module('mainApp', ['ngRoute', 'navigation', 'signup'])
    .config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
        	templateUrl: '/home',
        	controller: 'homeController'
        })
        .when('/signup', {
            templateUrl: '/signup',
            controller: 'signupController'
        })
        .when('/chat', {
            templateUrl: '/chat',
            controller: 'chatController'
        })
        .when('/about', {
            templateUrl: '/about',
            controller: 'aboutController'
        })
        .otherwise({ 
        	redirectTo : '/'
        });
    })
    .run(function ($rootScope, $mdToast, $location, $http) {
        $rootScope.socket = io();
        //array of objects
        $rootScope.chatList = [];
        var alleyUser = lsGet('alleyUser');
        if (alleyUser) {
            $rootScope.user = alleyUser;
        } else {
            $rootScope.user = {
                username: 'Guest'
            };
        }
        $rootScope.$watch('user', function () {
            var reqUserDetails = {
                method: 'POST',
                url: constants.getUserDetails.url,
                data: {},
                header: {}
            };
            $http(reqUserDetails).then(function successCallback (response) {
                user = response.data[0];
                if (user && user.hasOwnProperty('username') && user ) {
                    $rootScope.user = user;
                    lsSet('alleyUser', user);
                    $location.path('/chat');
                } else {
                    $rootScope.user = {
                        username: 'Guest'
                    };
                    $location.path('/signup');
                }
            }, function errorCallback (response) {
                console.log('error in getting username: ' + response);
            });
        }, true);
        $rootScope.alert = function (text, duration) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(duration)
            );
        };
        $rootScope.$on('$locationChangeStart', function (event, nextUrl, currentUrl) {
            var i = nextUrl.indexOf('#');
            var path = nextUrl.substring(i + 1);
            if (path == '/chat') {
                if ($rootScope.user.username == 'Guest') {
                    event.preventDefault();
                    $location.path('/signup');
                }
            } else if (path == '/signup') {
                if ($rootScope.user.username != 'Guest') {
                    event.preventDefault();
                    $location.path('/chat');
                }
            }
        });
    })
    .controller('homeController', function ($rootScope, $http, $location) {
        var reqUserDetails = {
            method: 'POST',
            url: constants.getUserDetails.url,
            data: {},
            header: {}
        };
        $http(reqUserDetails).then(function successCallback (response) {
            user = response.data[0];
            if (user && user.hasOwnProperty('username')) {
                $rootScope.user = user;
                lsSet('alleyUser', user);
                $location.path('/chat');
            } else {
                $location.path('/signup');
            }
        }, function errorCallback (response) {
            console.log('error in getting username: ' + response);
        });
    })
    .controller('aboutController', function ($rootScope, $scope, $http, $location) {

    })
    .controller('chatController', function ($rootScope, $scope, $http, $location) {
        $scope.userUnderChat = {};
        $scope.connect = function (user) {
            var username = user.username;
            user.message = [];
            $scope.userUnderChat = user;
        };
        $scope.disconnect = function (user) {
            //remove from chatList
            if (user.username == $scope.userUnderChat.username) {
                $scope.userUnderChat = {};
            }
            for (var i = 0; i < $rootScope.chatList.length; i++) {
                var u = $rootScope.chatList[i];
                if (u.username == user.username) {
                    break;
                }
            }
            $rootScope.chatList.splice(i, 1);
            $scope.$apply();
        };
        $scope.sendMessage = function () {
            if ($scope.userUnderChat.hasOwnProperty('username')) {
                var message = $scope.typedMessage.value;
                $scope.typedMessage.value = '';
                var sender = $rootScope.user.username;
                var receiver = $scope.userUnderChat.username;
                $rootScope.socket.emit('chatFromClient', sender, receiver, message);
                var para = '<span class="client">' + message + '</span>';
                $scope.userUnderChat.message.push(para);
            } else {
                $rootScope.alert('Please select any user to chat', 3000);
            }
        };
        $rootScope.socket.on('chatFromServer', function (sender, message) {
            checkAndPushMessage(sender, message);
        });
        function checkAndPushMessage (username, message) {
            message = "<span class='server'>" + message + "</span>";
            var found = 0;
            for (i in $rootScope.chatList) {
                var obj = $rootScope.chatList[i];
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
                $rootScope.chatList.push(tempObject);
                $scope.userUnderChat = tempObject;
            }
            $scope.$apply();
        }
    });

