'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/menu', {
		templateUrl : 'views/menu.html',
		controller : 'menuController'
	});

}).controller('menuController', function($scope, $http, $timeout) {

	$http({
		method : "get",
		url : "../exp/public.query!getDefaultPeriod",
		data : {}
	}).success(function(res) {
		$scope.user_name = res.outParam.user_name;
	});
	
	$scope.menusList = [ [ {
		name : "凭证管理",
		href : "#/itemListManager",
		icon : "../images/f-pzgl.png"
	},{
		name : "凭证登记(简)",
		href : "#/itemDetailM",
		icon : "../images/f-pzdjj.png"
	},{
		name : "凭证登记",
		href : "#/itemDetailMMult",
		icon : "../images/f-pzdj.png"
	},{
		name : "凭证查询",
		href : "#/itemList",
		icon : "../images/f-pzcx.png"
	}],

	[  {
		name : "科目余额",
		href : "#/accountAmountlist",
		icon : "../images/f-kmye.png"
	} ,{
		name : "费用明细",
		href : "#/bugetAmountList",
		icon : "../images/f-fymx.png"
	}],

	]

	$scope.back = function() {
		location.href = "#/login";
	}
	
	$timeout(function(){
		$(".menuitem").mouseover(function(){
			$(this).css("background-color","#eee"); 
		});

		$(".menuitem").mouseout(function(){
			$(this).css("background-color","#fff");
		});
	},0)

});
