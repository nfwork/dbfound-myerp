<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html style="height: 100%">
<head>
<jsp:include page="base.jsp" />
</head>

<body style="height: 100%">
	<div class="panel panel-primary"  style="height:100%;margin-bottom:0px">
		<div class="panel-heading">
			<b>MyERP-功能菜单</b>
		</div>
		<div class="panel-body">
			<a href="mobile/itemListManager.jsp" class="btn btn-success btn-lg btn-block">凭证管理</a> <a href="mobile/itemList.jsp" style="margin-top: 10px"
				class="btn btn-info btn-lg btn-block">凭证查询</a> <a href="mobile/accountAmountlist.jsp" style="margin-top: 10px"
				class="btn btn-warning btn-lg btn-block">科目余额</a> <a href="mobile/bugetAmountList.jsp" style="margin-top: 10px"
				class="btn btn-primary btn-lg btn-block">费用明细</a>
		</div>
	</div>
</body>

</html>