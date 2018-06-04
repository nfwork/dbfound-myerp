'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemDetailMMult', {
		templateUrl : 'views/itemDetailMMult.html',
		controller : 'itemDetailMMultController'
	});

}).controller('itemDetailMMultController', function($scope, $http, $cookies, $timeout, $location, ToolService) {
	
	$scope.item_id = $location.search().item_id;
	$scope.dataIndex = -1;

	$scope.header={};
	$scope.line={};
	
	if(!$scope.item_id){
		$http({
			method : "get",
			url : "../exp/public.query!getDefaultPeriod",
			data : {}
		}).success(function(res) {
			$scope.header.add_user = res.outParam.user_name;
			$scope.header.exp_time = res.datas[0].exp_time;
		});
	}else{
		$http({
			method : "get",
			url : "../exp/item.query!getDeatil?item_id=" + $scope.item_id
		}).success(function(res) {
			if(res.datas.length>0){
				$scope.header = res.datas[0];
			};
		})
	}

	$http({
		method : "get",
		url : "../fnd/expPeriod.query!combo",
		data : {}
	}).success(function(res) {
		res.datas.unshift({
			period_name : "---请选择---"
		})
		$scope.preiods = res.datas;
		$scope.header.period_id = res.datas[res.datas.length - 1].period_id;
		$timeout(function(){$("#period_id").selectpicker();},0)
	})

	$http({
		method : "get",
		url : "../fnd/expAccount.query",
		data : {}
	}).success(function(res) {
		res.datas.unshift({
			account_id : "",
			account_name : "---请选择---"
		})
		$scope.accounts = res.datas;
		$timeout(function(){$("#account_id").selectpicker();},0)
	})
	
	$scope.$watch("line.account_id",function(){
		$timeout(function(){$("#account_id").selectpicker("refresh");},0)
	});
	
	function modalShow() {
		$("#modal").modal().css({
			"margin-top" : function() {
				return 30;
			}
		});
	}

	$scope.addLine = function() {
		$('#detailTable').bootstrapTable('uncheckAll');
		$scope.dataIndex = -1;
		$scope.line={account_id:""};
		modalShow();
	}

	$scope.updateLine = function() {
		var rows = $('#detailTable').bootstrapTable('getSelections');
		if(rows.length ==0){
			alert("请选择行");
			return;
		}
		$scope.line = rows[0];
		modalShow();
	}

	$scope.addData = function() {
		
		if (!$scope.line.account_id || $scope.line.account_id == "" || $scope.line.account_id == null) {
			alert("科目不能为空！")
			return;
		}
		
		if($scope.line.cr_amount == null){
			$scope.line.cr_amount = "";
		}
		
		if($scope.line.dr_amount == null){
			$scope.line.dr_amount = "";
		}
		
		if ($scope.line.cr_amount =="" && $scope.line.dr_amount =="") {
			alert("借贷不能同时为空！")
			return;
		}

		if ($scope.line.cr_amount != "" && $scope.line.dr_amount != "") {
			alert("借贷不能同时有值！")
			return;
		}

		if ($scope.dataIndex == -1) {
			for(var i=1; i< $scope.accounts.length; i++){
				if($scope.accounts[i].account_id == $scope.line.account_id ){
					$scope.line.account_name = $scope.accounts[i].account_name;
					break;
				}
			}
			$('#detailTable').bootstrapTable('insertRow',{index:10000, row:$scope.line});
		} else {
			$('#detailTable').bootstrapTable('updateRow',{index:$scope.dataIndex, row:$scope.line});
		}

		$("#modal").modal("hide");
	}

	$scope.saveData = function (){
		
		var datas = $('#detailTable').bootstrapTable('getData');
		
		var dr_amount = 0;
		var cr_amount = 0;
		for (var i = 0; i < datas.length; i++) {
			var d_amount = datas[i].dr_amount;
			if (d_amount && d_amount != "" && d_amount !=null) {
				dr_amount = ToolService.add(dr_amount, d_amount);
			}
			var c_amount = datas[i].cr_amount;
			if (c_amount && c_amount != "" && c_amount != null) {
				cr_amount = ToolService.add(cr_amount, c_amount);
			}
		}
		if (dr_amount != cr_amount) {
			alert("借贷不平，借方金额：" + dr_amount + "，贷方金额：" + cr_amount + "，请确认");
			return;
		}

		$.ajax({
			url : "../mobile/item.do!saveBatch",
			data : {
				GridData : JSON.stringify(datas),
				period_id : $scope.header.period_id,
				exp_time : $scope.header.exp_time,
				description : $scope.header.description,
				item_id : $scope.item_id
			},
			dataType : "json",
			type : "post",
			success : function(res) {
				if (res.success) {
					alert("凭证录入成功！")
					history.back();
				} else {
					alert(res.message)
				}
			}
		})
	}

	//初始化凭证明细table
	var height = $(window).height() - 385;
	if (height < 150) {
		height = 150;
	}
	$('#detailTable').bootstrapTable({
		url : "../exp/itemLine.query",
		striped : true,
		height : height,
		contentType : "application/x-www-form-urlencoded",
		method : 'post',
		dataType : "json",
		responseHandler : function(res) {
			return ToolService.tableResponseHandle(res);
		},
		queryParams : function(params) {
			params.item_id = $scope.item_id;
			return params;
		},
		onCheck : function(row, element) {
			$scope.dataIndex = element.data('index');
		}
	});
	
	$scope.back = function() {
		location.href = "#/itemListManager";
	}
});
