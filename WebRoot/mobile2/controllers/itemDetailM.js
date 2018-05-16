'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemDetailM', {
		templateUrl : 'views/itemDetailM.html',
		controller : 'itemDetailMController'
	});

}).controller('itemDetailMController', function($scope, $http, $cookies) {

	$.ajax({
		url : "../exp/public.query!getDefaultPeriod",
		data : {},
		dataType : "json",
		type : "post",
		success : function(res) {
			$scope.add_user = res.outParam.user_name;
			$scope.exp_time = res.datas[0].exp_time;
		}
	});
	
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
			$scope.period_id = res.datas[res.datas.length - 1].period_id;
		}
	})
	
	$.ajax({
		url : "../fnd/expAccount.query",
		data : {},
		dataType : "json",
		type : "post",
		success : function(res) {
			res.datas.unshift({
				account_name : "---请选择---"
			})
			$scope.accounts = res.datas;
		}
	})

	
	$scope.resetData = function() {
		$("#registForm")[0].reset();
		$('select').selectpicker('render');
	}

	$scope.saveData = function() {
		var username = $("#username").val();
		var password = $("#password").val();
		$.ajax({
			url : "../mobile/item.do!save",
			data : $('#registForm').serialize(),
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
	
	$scope.back = function(){
		location.href = "#/itemListManager";
	}
});
