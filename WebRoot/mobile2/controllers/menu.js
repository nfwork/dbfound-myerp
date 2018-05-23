'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/menu', {
		templateUrl : 'views/menu.html',
		controller : 'menuController',
		resolve:{
			homeAnalysis:function($http){
            	return $http.get("../report/homeAnalysis.query").then(function(res){
        			return res.data;
            	});
            }
        }
	});

}).controller('menuController', function($scope, $http, $timeout, homeAnalysis) {
	
	if(homeAnalysis.timeout){
		location.href = "#/login";
	}
	
	$scope.user_name = homeAnalysis.outParam.user_name;
	$scope.totalexp = homeAnalysis.datas[0].totalexp;
	
	if(homeAnalysis.datas.length == 2){
		$scope.datasList  = [[homeAnalysis.datas[1]]];
	}else if(homeAnalysis.datas.length == 3){
		$scope.datasList  = [[homeAnalysis.datas[1],homeAnalysis.datas[2]]];
	}else if(homeAnalysis.datas.length == 4){
		$scope.datasList  = [[homeAnalysis.datas[1],homeAnalysis.datas[2]], [homeAnalysis.datas[3]]];
	}else if(homeAnalysis.datas.length == 5){
		$scope.datasList  = [[homeAnalysis.datas[1],homeAnalysis.datas[2]], [homeAnalysis.datas[3],homeAnalysis.datas[4]]];
	}
	
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
	}, {
		name : "期间汇总",
		href : "#/periodAmountReport",
		icon : "../images/f-qjhz.png"
	}],

	]

	$scope.back = function() {
		location.href = "#/login";
	}
	
	$timeout(function(){
		$(".menuitem").mouseenter(function(){
			$(this).css("background-color","#eee"); 
		});

		$(".menuitem").mouseleave(function(){
			$(this).css("background-color","#fff");
		});
	},0)

});
