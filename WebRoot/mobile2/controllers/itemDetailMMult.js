'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemDetailMMult', {
		templateUrl : 'views/itemDetailMMult.html',
		controller : 'itemDetailMMultController'
	});

}).controller('itemDetailMMultController', function($scope, $http, $cookies, $location, BootTableResponseHandle) {
	
	$scope.item_id = $location.search().item_id;
	$scope.data = [];
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
	
	function modalShow() {
		$("#modal").modal().css({
			"margin-top" : function() {
				return 30;
			}
		});
	}

	$scope.addLine = function() {
		$scope.dataIndex = -1;
		$scope.line={account_id:"",cr_amount:null,dr_amount:null};
		modalShow();
	}

	$scope.updateLine = function() {
		var rows = $('#detailTable').bootstrapTable('getSelections');
		if(rows.length ==0){
			alert("请选择行");
			return;
		}
		var row = rows[0];
		for (var i = 0; i < $scope.data.length; i++) {
			if($scope.data[i].item_line_id == row.item_line_id){
				$scope.dataIndex = i;
				break;
			}
		}
		$scope.line = {
			account_id : row.account_id,
			cr_amount : row.cr_amount,
			dr_amount : row.dr_amount,
			description : row.description
		};
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
			var d = {
					account_id : $scope.line.account_id,
					cr_amount : $scope.line.cr_amount,
					dr_amount : $scope.line.dr_amount,
					description : $scope.line.description
				}
			
			for(var i=1; i< $scope.accounts.length; i++){
				if($scope.accounts[i].account_id == $scope.line.account_id ){
					d.account_name = $scope.accounts[i].account_name;
					break;
				}
			}
			
			$scope.data.push(d);
		} else {
			$scope.data[$scope.dataIndex].account_id = $scope.line.account_id;
			$scope.data[$scope.dataIndex].cr_amount = $scope.line.cr_amount;
			$scope.data[$scope.dataIndex].dr_amount = $scope.line.dr_amount;
			$scope.data[$scope.dataIndex].description = $scope.line.description;
		}

		var res = {
			rows : $scope.data,
			total : $scope.data.length
		};

		$('#detailTable').bootstrapTable('load', res);
		$("#modal").modal("hide");
	}

	$scope.saveData = function (){
		var dr_amount = 0;
		var cr_amount = 0;
		for (var i = 0; i < $scope.data.length; i++) {
			var d_amount = $scope.data[i].dr_amount;
			if (d_amount && d_amount != "" && d_amount !=null) {
				dr_amount = add(dr_amount, d_amount);
			}
			var c_amount = $scope.data[i].cr_amount;
			if (c_amount && c_amount != "" && c_amount != null) {
				cr_amount = add(cr_amount, c_amount);
			}
		}
		if (dr_amount != cr_amount) {
			alert("借贷不平，借方金额：" + dr_amount + "，贷方金额：" + cr_amount + "，请确认");
			return;
		}

		$.ajax({
			url : "../mobile/item.do!saveBatch",
			data : {
				GridData : JSON.stringify($scope.data),
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
			if (res.datas && res.datas.length > 0) {
				$scope.data = res.datas;
			}
			return BootTableResponseHandle.tableResponseHandle(res);
		},
		queryParams : function(params) {
			params.item_id = $scope.item_id;
			return params;
		},
	});
	
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
	
	$scope.back = function() {
		location.href = "#/itemListManager";
	}
});
