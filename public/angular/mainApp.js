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
            $rootScope.socket.emit('makeUsernameIdPair', alleyUser);
        } else {
            $rootScope.user = {
                username: 'Guest'
            };
        }
        $rootScope.$watch(function () {
            return $rootScope.user;
        }, function () {
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
                    if ($location.path() != '/about') {
                        $location.path('/chat');
                    }
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
    .controller('chatController', function ($rootScope, $scope, $http, $location, $mdSidenav) {
        var chatMessagesDiv = angular.element(document).find('#chatMessagesDiv');
        $rootScope.userUnderChat = {};
        $scope.connect = function (user) {
            user.newMessagesCount = 0;
            $rootScope.userUnderChat = user;
        };
        $scope.disconnect = function (user, event) {
            event.stopPropagation();
            //remove from chatList
            if (user.username == $rootScope.userUnderChat.username) {
                $rootScope.userUnderChat = {};
            }
            for (var i = 0; i < $rootScope.chatList.length; i++) {
                var u = $rootScope.chatList[i];
                if (u.username == user.username) {
                    break;
                }
            }
            $rootScope.chatList.splice(i, 1);
        };
        $scope.sendMessage = function () {
            //scrollToBottom();
            if ($rootScope.userUnderChat.hasOwnProperty('username')) {
                var message = $scope.typedMessage.value;
                $scope.typedMessage.value = '';
                var sender = $rootScope.user;
                var receiver = $rootScope.userUnderChat;
                var messageObject = {
                    value: message,
                    class: 'server',
                    time: new Date()
                };
                $rootScope.socket.emit('chatFromClient', sender, receiver, messageObject);
                messageObject.class = 'client';
                $rootScope.userUnderChat.message.push(messageObject);
            } else {
                $rootScope.alert('Please select any user to chat from your chat list', 3000);
            }
        };
        $rootScope.socket.on('chatFromServer', function (sender, message) {
            checkAndPushMessage(sender, message);
            //scrollToBottom();
        });
        function checkAndPushMessage (sender, messageObject) {
            var found = 0;
            for (var i in $rootScope.chatList) {
                var obj = $rootScope.chatList[i];
                if (obj.username == sender.username) {
                    found = 1;
                    obj.message.push(messageObject);
                    if (i != 0 && obj.username != $rootScope.userUnderChat.username) {
                        //extract and push at top
                        $rootScope.chatList.splice(i, 1);
                        $rootScope.chatList.unshift(obj);
                    }
                    if (obj.username != $rootScope.userUnderChat.username) {
                        obj.newMessagesCount += 1;
                    }
                    break;
                }
            }
            if (found == 0) {
                sender.message = [];
                sender.message.push(messageObject);
                //push at top
                $rootScope.chatList.unshift(sender);
                if (!$rootScope.userUnderChat.hasOwnProperty('username') || $rootScope.userUnderChat.message.length == 0) {
                    $rootScope.userUnderChat = sender;
                    sender.newMessagesCount = 0;
                } else {
                    sender.newMessagesCount = 1;
                }
            }
            $scope.$apply();
        }
        $scope.toggleHiddenSidenav = function () {
            $mdSidenav('hiddenLeftSidenav').toggle();
        };
        function scrollToBottom () {
            var isScrolledToBottom = chatMessagesDiv.scrollHeight - chatMessagesDiv.clientHeight <= chatMessagesDiv.scrollTop + 1;
            if (!isScrolledToBottom) {
                chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight - chatMessagesDiv.clientHeight;
            }
        }
    });

