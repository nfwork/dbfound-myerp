'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemDetailM', {
		templateUrl : 'views/itemDetailM.html',
		controller : 'itemDetailMController'
	});

}).controller('itemDetailMController', function($scope, $http, $cookies) {

	$scope.data = {};
	
	$http({
		method : "get",
		url : "../exp/public.query!getDefaultPeriod",
		data : {}
	}).success(function(res) {
		$scope.data.add_user = res.outParam.user_name;
		$scope.data.exp_time = res.datas[0].exp_time;
	});

	$http({
		method : "get",
		url : "../fnd/expPeriod.query!combo",
		data : {}
	}).success(function(res) {
		res.datas.unshift({
			period_name : "---请选择---"
		})
		$scope.preiods = res.datas;
		$scope.data.period_id = res.datas[res.datas.length - 1].period_id;
	})

	$http({
		method : "get",
		url : "../fnd/expAccount.query",
		data : {}
	}).success(function(res) {
		res.datas.unshift({
			account_name : "---请选择---"
		})
		$scope.accounts = res.datas;
	})

	$scope.resetData = function() {
		$("#registForm")[0].reset();
		$('select').selectpicker('render');
	}

	$scope.saveData = function() {
		$.ajax({
			url : "../mobile/item.do!save",
			data : $scope.data,
			dataType : "json",
			type : "post",
			success : function(res) {
				if (res.success) {
					alert("凭证录入成功！")
					$scope.back();
				} else {
					alert(res.message)
				}
			}
		})
	}

	$scope.back = function() {
		location.href = "#/itemListManager";
	}
});
