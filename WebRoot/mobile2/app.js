'use strict';
angular.module('myerpApp', [ 'ngRoute','ngCookies' ]).config(function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo : '/login'
	});
}).controller('myerpController', function($scope, $http) {

});
