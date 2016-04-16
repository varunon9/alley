/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var navigation = angular.module('navigation', []);

navigation.controller('navigationController', function ($scope) {
    var socket = io();
    socket.on('connect', function () {
       console.log('connected'); 
    });
});