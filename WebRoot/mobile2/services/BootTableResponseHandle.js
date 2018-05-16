'use strict';
angular.module('myerpApp').factory('BootTableResponseHandle', function BootTableResponseHandle() {
    return {
    	tableResponseHandle : function(res) {
    		if (res.timeout) {
    			location.href = "#/login";
    		}
    		var r = {};
    		r.total = res.totalCounts;
    		r.rows = res.datas;
    		return r;
    	}
    };
});
