'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'views/login.html',
		controller : 'loginController'
	});

}).controller('loginController', function($scope, $http, $cookies) {
	$scope.user_code = $cookies.get("user_code");
	$scope.login = function() {
		$.ajax({
			url : "../sys/login.execute",
			data : {
				user_code : $scope.user_code,
				password : $scope.password
			},
			dataType : "json",
			type : "post",
			success : function(res) {
				if (res.success) {
					location.href = "#/menu"
				} else {
					alert(res.message)
				}
			}
		})
	}
});
