'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/menu', {
		templateUrl : 'views/menu.html',
		controller : 'menuController'
	});

}).controller('menuController', function($scope, $http, $timeout) {

	$http({
		method : "get",
		url : "../report/homeAnalysis.query",
		data : {}
	}).success(function(res) {
		if(res.success){
			$scope.totalexp = res.datas[0].totalexp;
			if(res.datas.length == 2){
				$scope.datasList  = [[res.datas[1]]];
			}else if(res.datas.length == 3){
				$scope.datasList  = [[res.datas[1],res.datas[2]]];
			}else if(res.datas.length == 4){
				$scope.datasList  = [[res.datas[1],res.datas[2]], [res.datas[3]]];
			}else if(res.datas.length == 5){
				$scope.datasList  = [[res.datas[1],res.datas[2]], [res.datas[3],res.datas[4]]];
			}
		}else{
			alert(res.message);
			$scope.back();
		}
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
