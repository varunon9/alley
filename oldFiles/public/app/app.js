var app = angular.module('app',['ngRoute','searchController']);
app.config(['$routeProvider',function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'app/components/search/searchView.html',
			controller: 'searchController'
		})
		.when('/register',{
			templateUrl: 'app/components/register/registerView.html',
			controller: 'registerController'
		})
		/*.when('/',{
			templateUrl: 'app/components/search/searchView.html',
			controller: 'searchController'
		})*/
		.otherwise({ redirectTo : '/'});
}]);

