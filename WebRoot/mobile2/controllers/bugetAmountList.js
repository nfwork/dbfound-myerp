'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/bugetAmountList', {
		templateUrl : 'views/bugetAmountList.html',
		controller : 'bugetAmountListController'
	});

}).controller('bugetAmountListController', function($scope, $http, $timeout, $cookies, ToolService) {
	
	$http({
		method : "get",
		url : "../exp/public.query!getDefaultPeriod",
		data : {}
	}).success(function(res) {
		$scope.preiod = res.datas[0].period;
		initPeriod();
		initTable();
	});
	
	function initPeriod(){
		$http({
			method : "get",
			url : "../fnd/expPeriod.query!comboAll",
			data : {}
		}).success(function(res) {
			res.datas.unshift({
				period_name : "---请选择---"
			})
			$scope.preiods = res.datas;
			$timeout(function(){$("#preiod").selectpicker();},0)
		});
	}
	
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
					append_amount = ToolService.add(append_amount, items[i].append_amount);
					emerge_amount = ToolService.add(emerge_amount, items[i].emerge_amount);
					end_amount = ToolService.add(end_amount, items[i].end_amount);
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
				
				return ToolService.tableResponseHandle(res);
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
			responseHandler : ToolService.tableResponseHandle,
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
