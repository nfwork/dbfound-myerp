'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/periodAmountReport', {
		templateUrl : 'views/periodAmountReport.html?v=2',
		controller : 'periodAmountReportController'
	});

}).controller('periodAmountReportController', function($scope, $http, $timeout, $cookies, ToolService) {
	
	var myDate = new Date();     
	var cyear=myDate.getFullYear();        //获取当前年
	var lastyear = cyear - 1;
	var lasttwoyear = cyear -2;
	var lastthreeyear = cyear -3;
	
	
	$scope.pitems = [{item_name: cyear+"年", item_value: cyear,selected:"true"},
	                 {item_name: lastyear + "年", item_value: lastyear,selected:"false"},
	                 {item_name: lasttwoyear + "年", item_value:lasttwoyear,selected:"false"},
	                 {item_name: lastthreeyear + "年", item_value:lastthreeyear,selected:"false"},
	                 {item_name:"全部", item_value:"",selected:"false"}
	                 ];
	
	$scope.periodYear = {value:cyear}; 
	
	$scope.initTable  = function(){
		
		var periodfrom = "";
		var periodto = "";
		if($scope.periodYear.value != ""){
			periodfrom = $scope.periodYear.value + "01";
			periodto =  $scope.periodYear.value + "12";
		}
		
		$http({
			method : "post",
			url : "../report/periodAmountReport.query?periodfrom="+periodfrom+"&periodto="+periodto,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
			data :   {}
		}).success(function(res) {
			
			$timeout(function(){
				var height = $(window).height()-115;
				
				var json={c:'合计'};
				for(var i=0;i<res.datas.length;i++){
					for(var j=0;j<res.columns.length;j++){
						var column = res.columns[j];
						var c = json[column.jsName];
						if(c==null){
							c=0;
							json[column.jsName]=c;
						}
						var cc= res.datas[i][column.jsName];
						if(cc>0){
							json[column.jsName] = ToolService.add(c,cc);
						}
					}
				}
				res.datas.push(json);
				
				$('#table').bootstrapTable('destroy');
				
				var columns = [{"align":"center","field":"c" , "title":"　会计期间　"}];
				
				for(var i=0;i<res.columns.length;i++){
					columns.push({"align":"right","field":res.columns[i].jsName , "title":res.columns[i].javaName })
				}
				
				$('#table').bootstrapTable({
					data: res.datas,
					striped : true,
					height :height,
					columns:columns
				});
				$scope.showTable = true;
			},0);
		});
	}
	
	
	$scope.back = function() {
		location.href = "#/menu";
	}
	
	
	$scope.initTable();
	
});
