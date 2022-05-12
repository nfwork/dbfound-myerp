'use strict';
angular.module('myerpApp', [ 'ngRoute','ngCookies' ]).config(function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo : '/login'
	});
}).config(function($httpProvider){
	$httpProvider.interceptors.push(function($q) {
		return {
		    response: function(response) {
		    	if(response.data){
		    		if(response.data.timeout){
			    		location.href="#/login";
			    	}else if(response.data.success == false){
			    		alert(response.data.message);
			    	}
		    	}
		    	return response;
		    },
		};
	});
}).controller('myerpController', function($scope, $http) {

}).run(function($rootScope, $templateCache) {  
    $rootScope.$on('$routeChangeStart', function(event, next, current) {  
        if (typeof(current) !== 'undefined'){  
            $templateCache.remove(current.templateUrl);  
        }  
    });  
});
