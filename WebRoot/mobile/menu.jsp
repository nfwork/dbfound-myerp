<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta name="viewport" content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap-theme.min.css">
<script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>
<script src="http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<jsp:include page="../modules/base/floatBase.jsp"/>
</head>

  <body>
	<div class="panel panel-primary">
	  <div class="panel-heading">功能菜单</div>
	  <div class="panel-body">
			  <a href="itemListManager.jsp" class="btn btn-success btn-lg btn-block">凭证管理</a>
			  <a href="itemList.jsp" style="margin-top:10px" class="btn btn-info btn-lg btn-block">凭证查询</a>
			  <a href="accountAmountlist.jsp" style="margin-top:10px" class="btn btn-warning btn-lg btn-block">科目余额</a>
			  <a href="bugetAmountList.jsp" style="margin-top:10px" class="btn btn-primary btn-lg btn-block">费用明细</a>
		</div>
	</div>
  </body>
  
</html>