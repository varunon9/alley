/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var mainApp = angular.module('mainApp', ['ngRoute', 'navigation']);

/*mainApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
        	templateUrl: '/home',
        	controller: 'navigationController'
        })
        .otherwise({ 
        	redirectTo : '/'
        });
});*/
//integrating material-design-lite in angularjs
//http://stackoverflow.com/questions/31278781/material-design-lite-integration-with-angularjs
mainApp.run(function ($rootScope, $timeout) {
    $rootScope.$on('$viewContentLoaded', ()=> {
        $timeout(() => {
            componentHandler.upgradeAllRegistered();
        })
    })
});
