'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/menu', {
		templateUrl : 'views/menu.html',
		controller : 'menuController'
	});

}).controller('menuController', function($scope, $http) {

	$scope.menus = [ {
		name : "凭证管理",
		href : "#/itemListManager",
		icon : "../images/dj-1.png"
	}, {
		name : "凭证查询",
		href : "#/itemList",
		icon : "../images/cx-1.png"
	},{
		name : "科目余额",
		href : "#/accountAmountlist",
		icon : "../images/ye-1.png"
	},{
		name : "费用明细",
		href : "#/bugetAmountList",
		icon : "../images/mx-1.png"
	} ];
	
	$scope.back = function(){
		location.href = "#/login";
	}

});
