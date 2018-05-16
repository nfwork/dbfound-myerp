'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemDetailMMult', {
	//	templateUrl : 'views/itemDetailMMult.jsp',
		controller : 'itemDetailMMultController'
	});

}).controller('itemDetailMMultController', function($scope, $http, $cookies, $location, BootTableResponseHandle) {
	
});
