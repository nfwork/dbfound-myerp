<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<base href="${basePath}" />
<meta name="viewport" content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;">
<link rel="stylesheet" href="${basePath}bootstrap/bootstrap.min.css?v=3.2">
<link rel="stylesheet" href="${basePath}bootstrap/bootstrap-theme.min.css">
<script src="${basePath}DBFoundUI/chart/jquery.min.js"></script>
<script src="${basePath}bootstrap/bootstrap.min.js?v=3.2"></script>
<link rel="stylesheet" href="${basePath}bootstrap/bootstrap-table.min.css">
<script src="${basePath}bootstrap/bootstrap-table.min.js"></script>
<script src="${basePath}bootstrap/bootstrap-table-zh-CN.min.js"></script>

<link rel="stylesheet" href="${basePath}bootstrap/bootstrap-select.min.css">
<script src="${basePath}bootstrap/bootstrap-select.min.js"></script>

<title>MyERP财务系统</title>
<script type="text/javascript">
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
	$(function() {$("select").selectpicker();});
</script>

<style type="text/css">
.panel {
	border-radius: 0px;
	-moz-border-radius: 0px;
	-webkit-border-radius: 0px;
	border: 0px;
}

.panel-heading {
	border-radius: 0px;
	-moz-border-radius: 0px;
	-webkit-border-radius: 0px;
	top: 0;
    left: 0;
    z-index: 100;
    position: fixed;
    width: 100%;
}

.common-select {
	background-color: #fff;
	background-image: none;
	border: 1px solid #ccc;
}

.panel-body{
	margin-top:40px
}
</style>