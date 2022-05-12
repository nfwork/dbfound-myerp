'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemListManager', {
		templateUrl : 'views/itemListManager.html',
		controller : 'itemListManagerController',
		resolve:{
            periodCombo:function($http){
            	return $http.get("../fnd/expPeriod.query!combo").then(function(res){
        			return res.data;
            	});
            }
        }
	});

}).controller('itemListManagerController', function($scope, $http, $cookies, $timeout, ToolService, periodCombo) {

	$scope.preiods = periodCombo.datas;
	$scope.preiod = periodCombo.datas[periodCombo.datas.length - 1].period_id;
	
	$timeout(function(){$("#preiod").selectpicker();},0)

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
			params.description = $scope.description;
			params.start = params.offset;
			return params;
		},
		onClickCell : function(field, value, row, element) {
			if (field == "item_num") {
				return;
			}
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
