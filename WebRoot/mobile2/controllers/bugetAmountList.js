'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/bugetAmountList', {
		templateUrl : 'views/bugetAmountList.html',
		controller : 'bugetAmountListController'
	});

}).controller('bugetAmountListController', function($scope, $http, $timeout, $cookies, BootTableResponseHandle) {
	
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
			url : "../exp/amountManager.query",
			striped : true,
			responseHandler : function(res) {
				
				var items = res.datas;
				var append_amount = 0;
				var emerge_amount = 0;
				var end_amount = 0;
				for (var i = 0; i < items.length; i++) {
					append_amount = add(append_amount, items[i].append_amount);
					emerge_amount = add(emerge_amount, items[i].emerge_amount);
					end_amount = add(end_amount, items[i].end_amount);
				}
				var json = {};
				json.append_amount = "" + append_amount;
				json.emerge_amount = "" + emerge_amount;
				if (end_amount < 0) {
					json.end_amount = "" + "<b><font color='red'>"
							+ end_amount + "</font></b>";
				} else {
					json.end_amount = "" + end_amount;
				}
				json.account_name="合计："
				
				items.push(json);
				
				return BootTableResponseHandle.tableResponseHandle(res);
			},
			queryParams : function(params) {
				params.period_id =  $scope.preiod;
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
			height : height,
			responseHandler : BootTableResponseHandle.tableResponseHandle,
			queryParams : function(params) {
				params.period_id =  $scope.preiod;
				params.account_id = account_id;
				return params;
			},
		});
	}
	
	function add(num1, num2) {
		var r1, r2, m;
		try {
			r1 = num1.toString().split('.')[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = num2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));
		return Math.round(num1 * m + num2 * m) / m;
	}

	$scope.refresh = function(){
		account_id = 0;
		$('#table').bootstrapTable('refresh');
		$('#detailTable').bootstrapTable('refresh');
	}
	
	$('#preiod').change($scope.refresh)

	$scope.back = function() {
		location.href = "#/menu";
	}
	
});
