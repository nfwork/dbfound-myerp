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
		<div class="panel-body" style="text-align: center;margin-left:-4px;">

			<table style="width:99%">
				<tr>
					<td width="33%">
						<div style="">
							<a href="mobile/itemListManager.jsp"> <img class="btn btn-default btn-lg"
								style="margin: 3px; padding: 0px; width: 80px; height: 80px; border-radius: 35px;" src="images/gl.png"><br> <span
								style="margin-top: 3px">凭证管理</span>
							</a>
						</div>
					</td>
					<td width="33%">
						<div style="">
							<a href="mobile/itemList.jsp"> <img class="btn btn-default btn-lg"
								style="margin: 3px; padding: 0px; width: 80px; height: 80px; border-radius: 35px;" src="images/cx.png"><br> <span
								style="margin-top: 3px">凭证查询</span>
							</a>
						</div>
					</td>
					<td>
						<div style="margin:5px;margin-left:10px;margin-right:10px">
							<a href="mobile/accountAmountlist.jsp">  <img class="btn btn-default btn-lg"
								style="margin: 3px; padding: 0px; width: 80px; height: 80px; border-radius: 35px;" src="images/ye.png"><br> <span
								style="margin-top: 3px">科目余额</span>
							</a>
						</div>
					</td>
				</tr>
				<tr>
					<td>
						<div style="margin:5px;margin-left:10px;margin-right:10px">
							<a href="mobile/bugetAmountList.jsp"> <img class="btn btn-default btn-lg"
								style="margin: 3px; padding: 0px; width: 80px; height: 80px; border-radius: 35px;" src="images/mx.png"><br> <span
								style="margin-top: 3px">费用明细</span>
							</a>
						</div>
					</td>
				</tr>
			</table>








		</div>
	</div>
</body>

</html>