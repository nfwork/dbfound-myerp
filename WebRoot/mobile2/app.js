'use strict';
angular.module('myerpApp', [ 'ngRoute','ngCookies' ]).config(function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo : '/login'
	});
}).controller('myerpController', function($scope, $http) {

}).run(function($rootScope, $templateCache) {  
    $rootScope.$on('$routeChangeStart', function(event, next, current) {  
        if (typeof(current) !== 'undefined'){  
            $templateCache.remove(current.templateUrl);  
        }  
    });  
});  ;
