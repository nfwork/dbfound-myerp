'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemListManager', {
		templateUrl : 'views/itemListManager.html',
		controller : 'itemListManagerController'
	});

}).controller('itemListManagerController', function($scope, $http, $cookies) {

	$.ajax({
		url : "../fnd/expPeriod.query!combo",
		data : {},
		dataType : "json",
		type : "post",
		success : function(res) {
			res.datas.unshift({
				period_name : "---请选择---"
			})
			$scope.preiods = res.datas;
			$scope.preiod = res.datas[res.datas.length - 1].period_id;
			initTable();
		}
	})

	$scope.item_id = 0;

	function initTable() {
		$('#table').bootstrapTable({
			url : "../exp/item.query",
			striped : true,
			pagination : true,
			contentType : "application/x-www-form-urlencoded",
			method : 'post',
			pageSize : 5,
			responseHandler : tableResponseHandle,
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
			responseHandler : tableResponseHandle,
			queryParams : function(params) {
				params.period_id = $scope.period;
				params.item_id = $scope.item_id;
				return params;
			},
		});
	}

	$scope.refresh = function() {
		$scope.item_id = 0;
		$('#table').bootstrapTable('refresh');
		$('#detailTable').bootstrapTable('refresh');
	}

	function tableResponseHandle(res) {
		if (res.timeout) {
			location.href = "#/login";
		}
		var r = {};
		r.total = res.totalCounts;
		r.rows = res.datas;
		return r;
	}

	$('#preiod').change($scope.refresh)

	$('#description').keydown(function(e) {
		if (e.keyCode == 13) {
			$scope.refresh();
		}
	});
});
