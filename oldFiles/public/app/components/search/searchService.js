var searchService = angular.module('searchService', []);
searchService.factory('searchServiceFactory', function($http, $q) {
	var factory = {};
	/*var jobTitles = [
	    'teacher', 'home tutor', 'web developer', 'advocate', 'graphics designer', 'content writer',
	    'doctor', 'hr manager', 'financial manager', 'yoga trainer', 'karate trainer', 'watchman', 
	    'gardener', 'driver', 'java developer'
	];*/
	factory.getJobTitles = function() {
		var p = $q.defer();
		$http.get("/jobTitles",{cache:'true'})
		    .success(function(response) {
		     	p.resolve(response);
		    })
		    .error(function(error) {
		    	console.log(error);
		    });
		return p.promise;
	};
	return factory;
});