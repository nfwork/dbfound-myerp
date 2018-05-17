'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/itemDetailMMult', {
		templateUrl : 'views/itemDetailMMult.html',
		controller : 'itemDetailMMultController'
	});

}).controller('itemDetailMMultController', function($scope, $http, $cookies, $location, BootTableResponseHandle) {
	
	var item_id = $location.search().item_id;
	var data = [];
	var dataIndex = -1;

	$scope.header={};
	$scope.line={};
	
	if(!item_id){
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
			url : "../exp/item.query!getDeatil?item_id=" + item_id
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
		dataIndex = -1;
		$scope.line={account_id:"",cr_amount:null,dr_amount:null};
		modalShow();
	}

	$scope.updateLine = function(row) {
		for (var i = 0; i < data.length; i++) {
			if(data[i].item_line_id == row.item_line_id){
				dataIndex = i;
				break;
			}
		}
		$scope.line=data[dataIndex];
		modalShow();
	}

	$scope.addData = function() {
		
		if (!$scope.line.account_id || $scope.line.account_id == "" || $scope.line.account_id == null) {
			alert("科目不能为空！")
			return;
		}
		if ($scope.line.cr_amount == null && $scope.line.dr_amount == null) {
			alert("借贷不能同时为空！")
			return;
		}

		if ($scope.line.cr_amount != null && $scope.line.dr_amount != null) {
			alert("借贷不能同时有值！")
			return;
		}
		
		for(var i=1; i< $scope.accounts.length; i++){
			if($scope.accounts[i].account_id == $scope.line.account_id ){
				$scope.line.account_name = $scope.accounts[i].account_name;
			}
		}

		if (dataIndex == -1) {
			data.push($scope.line);
		} else {
			data[dataIndex] = $scope.line;
		}

		var res = {
			rows : data,
			total : data.length
		};

		$('#detailTable').bootstrapTable('load', res);
		$("#modal").modal("hide");
	}

	$scope.saveData = function (){
		var dr_amount = 0;
		var cr_amount = 0;
		for (var i = 0; i < data.length; i++) {
			d_amount = data[i].dr_amount;
			if (d_amount != "") {
				dr_amount = add(dr_amount, d_amount);
			}
			c_amount = data[i].cr_amount;
			if (c_amount != "") {
				cr_amount = add(cr_amount, c_amount);
			}
		}
		if (dr_amount != cr_amount) {
			alert("借贷不平，借方金额：" + dr_amount + "，贷方金额：" + cr_amount + "，请确认");
			return;
		}

		var exp_time = $("#exp_time").val();
		var period_id = $("#period_id").val();
		var description = $("#ht").val();

		$.ajax({
			url : "../mobile/item.do!saveBatch",
			data : {
				GridData : JSON.stringify(data),
				period_id : period_id,
				exp_time : exp_time,
				description : description,
				item_id : item_id
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
				data = res.datas;
			}
			return BootTableResponseHandle.tableResponseHandle(res);
		},
		onClickCell : function(field, value, row, element) {
			if (field == "account_name") {
				$scope.updateLine(row);
			}
		},
		queryParams : function(params) {
			params.item_id = item_id;
			return params;
		},
	});
	
	$scope.back = function() {
		location.href = "#/itemListManager";
	}
});
