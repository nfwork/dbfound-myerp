'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/accountAmountlist', {
		templateUrl : 'views/accountAmountlist.html',
		controller : 'accountAmountlistController'
	});

}).controller('accountAmountlistController', function($scope, $http, $timeout, $cookies, BootTableResponseHandle) {
	
	//period_name
	
	$http({
		method : "get",
		url : "../fnd/expPeriod.query!comboAll",
		data : {}
	}).success(function(res) {
		res.datas.unshift({
			period_name : "---请选择---"
		})
		$scope.preiods = res.datas;
	});
	
	$http({
		method : "get",
		url : "../exp/public.query!getDefaultPeriod",
		data : {}
	}).success(function(res) {
		$scope.preiod = res.datas[0].period;
		$timeout(function(){$("#preiod").selectpicker();},0)
		initTable();
	});
	
	var account_id = 0;
	
	function initTable(){
		$('#table').bootstrapTable({
			url : "../report/accountAmountQuery.query",
			striped : true,
			responseHandler : BootTableResponseHandle.tableResponseHandle,
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
			responseHandler : BootTableResponseHandle.tableResponseHandle,
			queryParams : function(params) {
				params.period_id =  $scope.preiod;
				params.account_id = account_id;
				return params;
			},
		});
	}

	$scope.refresh = function(){
		account_id = 0;
		$('#table').bootstrapTable('refresh');
		$('#detailTable').bootstrapTable('refresh');
	}
	
	$scope.back = function() {
		location.href = "#/menu";
	}
	
});
