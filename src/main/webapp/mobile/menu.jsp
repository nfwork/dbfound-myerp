<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="base.jsp" />
</head>

<body>
	<div class="panel panel-primary" style="margin-bottom: 0px;">
		<div class="panel-heading">
			<b>MyERP-功能菜单</b>
		</div>
		<div class="panel-body" style="text-align: center;padding:5px">

			<div style="margin: 5px; float: left">
				<a href="mobile/itemListManager.jsp" class="btn btn-default btn-lg"> <img
					style="margin: 3px; padding: 0px; width: 60px; height: 60px; border-radius: 35px;" src="images/dj-1.png"><br> <span
					style="margin-top: 3px">凭证管理</span>
				</a>
			</div>

			<div style="margin: 5px; float: left">
				<a href="mobile/itemList.jsp" class="btn btn-default btn-lg"> <img
					style="margin: 3px; padding: 0px; width: 60px; height: 60px; border-radius: 35px;" src="images/cx-1.png"><br> <span
					style="margin-top: 3px">凭证查询</span>
				</a>
			</div>

			<div style="margin: 5px; float: left">
				<a href="mobile/accountAmountlist.jsp" class="btn btn-default btn-lg"> <img
					style="margin: 3px; padding: 0px; width: 60px; height: 60px; border-radius: 35px;" src="images/ye-1.png"><br> <span
					style="margin-top: 3px">科目余额</span>
				</a>
			</div>

			<div style="margin: 5px; float: left">
				<a href="mobile/bugetAmountList.jsp" class="btn btn-default btn-lg"> <img
					style="margin: 3px; padding: 0px; width: 60px; height: 60px; border-radius: 35px;" src="images/mx-1.png"><br> <span
					style="margin-top: 3px">费用明细</span>
				</a>
			</div>

		</div>
	</div>
</body>

</html>