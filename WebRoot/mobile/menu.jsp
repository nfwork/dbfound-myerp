<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="base.jsp" />
<style type="text/css">
body {
    position:relative;
    overflow-y:hidden;
}
</style>
</head>

<body>
	<div class="panel panel-primary"  style="margin-bottom:0px;">
		<div class="panel-heading">
			<b>MyERP-功能菜单</b>
		</div>
		<div class="panel-body">
			<a href="mobile/itemListManager.jsp" class="btn btn-success btn-lg btn-block">凭证管理</a> <a href="mobile/itemList.jsp" style="margin-top: 10px"
				class="btn btn-info btn-lg btn-block">凭证查询</a> <a href="mobile/accountAmountlist.jsp" style="margin-top: 10px"
				class="btn btn-warning btn-lg btn-block">科目余额</a> <a href="mobile/bugetAmountList.jsp" style="margin-top: 10px"
				class="btn btn-primary btn-lg btn-block">费用明细</a>
			<div id="foot" style="height:1000px"></div>
		</div>
	</div>
	<script type="text/javascript">
	var bodyHeight = $(document.body).height();
	var windowHeight = $(window).height();
	var height = bodyHeight - windowHeight;
	$("#foot").height(1000-height-40);
	</script>
</body>

</html>