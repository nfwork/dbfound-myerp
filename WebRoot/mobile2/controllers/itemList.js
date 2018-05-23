'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemList', {
		templateUrl : 'views/itemList.html',
		controller : 'itemListController',
		resolve:{
			accountCombo:function($http){
            	return $http.get("../fnd/expAccount.query").then(function(res){
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

}).controller('itemListController', function($scope, $http, $cookies, $timeout, ToolService, accountCombo, periodCombo) {

	periodCombo.datas.unshift({
		period_name : "---请选择---"
	})
	$scope.preiods = periodCombo.datas;
	$timeout(function(){$("#preiod").selectpicker();},0)
	
	accountCombo.datas.unshift({
		account_name : "---请选择---"
	})
	$scope.accounts = accountCombo.datas;
	$timeout(function(){$("#account_id").selectpicker();},0)

	$scope.item_id = 0;

	$('#table').bootstrapTable({
		url : "../exp/item.query",
		striped : true,
		pagination : true,
		contentType : "application/x-www-form-urlencoded",
		method : 'post',
		pageSize : 5,
		responseHandler : ToolService.tableResponseHandle,
		queryParams : function(params) {
			params.period_id = $scope.preiod;
			params.account_id = $scope.account_id;
			params.description = $scope.description;
			params.start = params.offset;
			return params;
		},
		onClickRow : function(row, element) {
			$scope.item_id = row.item_id;
			$('#detailTable').bootstrapTable('refresh');
		},
		onLoadSuccess : function() {
			var a = $(".pull-left");
			// a.hide();
		}
	});

	$('#detailTable').bootstrapTable({
		url : "../exp/itemLine.query",
		striped : true,
		contentType : "application/x-www-form-urlencoded",
		method : 'post',
		responseHandler : ToolService.tableResponseHandle,
		queryParams : function(params) {
			params.period_id = $scope.period;
			params.item_id = $scope.item_id;
			return params;
		},
	});
	
	$scope.refresh = function() {
		$scope.item_id = 0;
		$('#table').bootstrapTable('refresh');
		$('#detailTable').bootstrapTable('refresh');
	}
	
	$scope.back = function(){
		location.href = "#/menu";
	}
});
