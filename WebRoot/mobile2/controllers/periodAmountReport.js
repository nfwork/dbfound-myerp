'use strict';
angular.module('myerpApp').config(function($routeProvider) {
	$routeProvider.when('/periodAmountReport', {
		templateUrl : 'views/periodAmountReport.html',
		controller : 'periodAmountReportController'
	});

}).controller('periodAmountReportController', function($scope, $http, $timeout, $cookies, ToolService) {
	
	$http({
		method : "get",
		url : "../report/periodAmountReport.execute",
		data : {}
	}).success(function(res) {
		$scope.columns = res.columns;
		
		$timeout(function(){
			var height = $(window).height()-70;
			
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
			
			$('#table').bootstrapTable({
				data: res.datas,
				striped : true,
				height :height
			});
			$scope.showTable = true;
		},0);
	});
	
	$scope.back = function() {
		location.href = "#/menu";
	}
	
});
