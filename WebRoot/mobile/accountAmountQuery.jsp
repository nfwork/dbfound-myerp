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
			<d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="comboAll" />
			<d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod" />
		</d:initProcedure>

		<d:form id="queryForm" title="查询条件" labelWidth="90">
			<d:line columnWidth="0.7">
				<d:field name="period_id" editable="false" value="${periods[0].period}" required="true" anchor="85%" options="periodStore" valueField="period_id"
					displayField="period_name" editor="combo" prompt="会计期间">
					<d:event name="select" handle="query" />
				</d:field>
				<d:field name="b" columnWidth="0.3" width="60" editor="button" prompt="查询">
					<d:event name="click" handle="query" />
				</d:field>
			</d:line>
		</d:form>

		<d:grid title="科目" id="listGrid" queryForm="queryForm" navBar="false" autoQuery="true" model="report/accountAmountQuery" height="200">
			<d:columns>
				<d:column name="account_name" width="130" sortable="true" required="true" prompt="科目名称" />
				<d:column name="remaind_amount" renderer="getData" width="100" align="right" prompt="期初余额" />
				<d:column name="emerge_amount" renderer="getData" width="100" align="right" prompt="本期增加" />
				<d:column name="end_amount" renderer="getData" width="100" align="right" prompt="期末余额" />
			</d:columns>
		</d:grid>

		<d:grid title="凭证明细" id="functionGrid" queryForm="queryForm" navBar="false" selectFirstRow="false"
			queryUrl="report/accountAmountQuery.query!getExpDetail" height="200">
			<d:columns>
				<d:column name="exp_time" sortable="true" prompt="费用日期" width="90" />
				<d:column name="dr_amount" align="right" sortable="true" prompt="借金金额" width="80" />
				<d:column name="cr_amount" align="right" sortable="true" prompt="贷方金额" width="80" />
				<d:column name="description" prompt="凭证描述" width="250" />
			</d:columns>
		</d:grid>

		<script type="text/javascript">
			listGrid.getSelectionModel().on("rowselect", function() {
				var account_id = listGrid.getCurrentRecordData().account_id;
				if (account_id != null) {
					functionGrid.getStore().baseParams.account_id = account_id;
					functionGrid.query();
				}
			});
		</script>
	</div>
</body>
</html>
