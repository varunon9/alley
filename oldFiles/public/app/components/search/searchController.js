var searchController = angular.module('searchController', ['searchService']);
searchController.controller('searchController', function($scope, searchServiceFactory) {
	$scope.jobTitles = '';
	var jobt = searchServiceFactory.getJobTitles();
	jobt.then(function(data){
		$scope.jobTitles=data;
	});
});