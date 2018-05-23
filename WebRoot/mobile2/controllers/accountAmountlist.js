'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/accountAmountlist', {
		templateUrl : 'views/accountAmountlist.html',
		controller : 'accountAmountlistController',
		resolve:{
			defaultPeriod:function($http){
            	return $http.get("../exp/public.query!getDefaultPeriod").then(function(res){
        			return res.data;
            	});
            },
            periodCombo:function($http){
            	return $http.get("../fnd/expPeriod.query!comboAll").then(function(res){
        			return res.data;
            	});
            }
        }
	});

}).controller('accountAmountlistController', function($scope, $http, $timeout, $cookies, ToolService, defaultPeriod, periodCombo) {
	
	$scope.preiod = defaultPeriod.datas[0].period;
	
	periodCombo.datas.unshift({
		period_name : "---请选择---"
	})
	$scope.preiods = periodCombo.datas;
	
	$timeout(function(){$("#preiod").selectpicker();},0)
	
	var account_id = 0;

	$('#table').bootstrapTable({
		url : "../report/accountAmountQuery.query",
		striped : true,
		responseHandler : ToolService.tableResponseHandle,
		queryParams : function(params) {
			params.period_id = $scope.preiod;
			return params;
		},
		onClickRow : function(row, element) {
			account_id = row.account_id;
			$('#detailTable').bootstrapTable('refresh');
		}
	});

	var height= $(window).height()-410;
	if(height<150){
		height=150;
	}
	$('#detailTable').bootstrapTable({
		url : "../report/accountAmountQuery.query!getExpDetail",
		striped : true,
		height:height,
		responseHandler : ToolService.tableResponseHandle,
		queryParams : function(params) {
			params.period_id =  $scope.preiod;
			params.account_id = account_id;
			return params;
		},
	});

	$scope.refresh = function(){
		account_id = 0;
		$('#table').bootstrapTable('refresh');
		$('#detailTable').bootstrapTable('refresh');
	}
	
	$scope.back = function() {
		location.href = "#/menu";
	}
	
});
