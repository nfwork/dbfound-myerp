<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE HTML>
<html>
<head>
<d:includeLibrary />
<meta name="viewport" content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
<script src="http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<jsp:include page="../modules/base/floatBase.jsp" />

<style type="text/css">
.ext-strict .x-form-text {
	height: 21px;
}

.ext-strict .ext-webkit .x-small-editor .x-form-text {
	height: 19px !important;
}
</style>
<script type="text/javascript">
	function query() {
		listGrid.query();
	}

	function openDetailWindow() {
		var datas = listGrid.getSelectionsData(true);
		if (datas.length == 0) {
			$D.showMessage("必须选中一行数据");
			return;
		}
		var url = "modules/exp/bugetAmountDetail.jsp?period_id="
				+ queryForm.getData().period_id + "&account_id="
				+ datas[0].account_id;
		DBFound.open("update_window", "本期添加", 600, 400, url);
	}

	function openAddWindow() {
		var datas = listGrid.getSelectionsData(true);
		if (datas.length == 0) {
			$D.showMessage("必须选中一行数据");
			return;
		}
		var url = "modules/exp/addBugetAmount.jsp?period_id="
				+ queryForm.getData().period_id + "&account_id="
				+ datas[0].account_id;
		DBFound.open("update_window", "本期添加", 600, 450, url);
	}

	function getData(value, meta, record) {
		if (value < 0) {
			return "<b><font color='red'>" + value + "</font></b>";
		} else {
			return value;
		}
	}
</script>
</head>

<body>
	<div class="panel panel-primary">
		<div class="panel-heading">科目余额</div>
		<d:initProcedure>
			<d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="${periodStoreQueryName}" />
			<d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod" />
		</d:initProcedure>

		<d:form id="queryForm" title="查询条件" labelWidth="80">
			<d:line columnWidth="0.8">
				<d:field name="period_id" editable="false" value="${periods[0].period}" required="true" anchor="85%" options="periodStore" valueField="period_id"
					displayField="period_name" editor="combo" prompt="会计期间">
					<d:event name="select" handle="query" />
				</d:field>
				<d:field name="b" columnWidth="0.2" width="60" editor="button" prompt="查询">
					<d:event name="click" handle="query" />
				</d:field>
			</d:line>
		</d:form>

		<d:grid id="listGrid" title="${gridTitle}" selectFirstRow="false" navBar="false" autoQuery="true" model="exp/amountManager" height="220"
			queryForm="queryForm">
			<d:columns>
				<d:column name="account_name" width="130" sortable="true" required="true" prompt="科目名称" />
				<d:column name="emerge_amount" width="100" align="right" prompt="本期发生" />
			</d:columns>
		</d:grid>

		<d:grid id="functionGrid" selectFirstRow="false" navBar="false" queryForm="queryForm" title="费用明细" queryUrl="exp/amountManager.query!getExpDetail"
			height="200">
			<d:columns>
				<d:column name="exp_time" sortable="true" prompt="费用日期" width="150" />
				<d:column name="dr_amount" align="right" sortable="true" prompt="借" width="90" />
				<d:column name="cr_amount" align="right" sortable="true" prompt="贷" width="90" />
				<d:column name="description" prompt="凭证描述" width="220" />
			</d:columns>
		</d:grid>

		<script type="text/javascript">
			listGrid.getSelectionModel().on("rowselect", function() {
				var account_id = listGrid.getCurrentRecordData().account_id;
				if (account_id != null) {
					queryForm.setData({
						account_id : account_id
					});
					functionGrid.query();
				}
			});

			listGrid.getStore().on(
					"load",
					function() {
						var items = this.data.items;
						var append_amount = 0;
						var emerge_amount = 0;
						var end_amount = 0;
						for (var i = 0; i < items.length; i++) {
							append_amount = add(append_amount, items[i]
									.get("append_amount"));
							emerge_amount = add(emerge_amount, items[i]
									.get("emerge_amount"));
							end_amount = add(end_amount, items[i]
									.get("end_amount"));
						}
						var json = {};
						json.append_amount = "" + append_amount;
						json.emerge_amount = "" + emerge_amount;
						if (end_amount < 0) {
							json.end_amount = "" + "<b><font color='red'>"
									+ end_amount + "</font></b>";
						} else {
							json.end_amount = "" + end_amount;
						}
						json.account_name="合计："
						listGrid.addLine(json, true);
						listGrid.getSelectionModel().selectFirstRow()
					});
		</script>
	</div>
</body>
</html>
