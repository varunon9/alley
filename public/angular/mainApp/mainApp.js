/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var mainApp = angular.module('mainApp', ['ngRoute', 'navigation']);

mainApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
        	templateUrl: 'users',
        	controller: 'navigationController'
        })
        .otherwise({ 
        	redirectTo : '/'
        });
});
