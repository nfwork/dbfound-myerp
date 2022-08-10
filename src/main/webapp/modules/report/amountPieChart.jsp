<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML>
<html>
	<head>
		<d:includeLibrary />
		<script type="text/javascript" src="DBFoundUI/chart/jquery.min.js"></script>
		<script src="DBFoundUI/chart/highcharts.js"></script>
	</head>

	<d:initProcedure>
		<d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="comboAll" />
		<d:query rootPath="request.periods" modelName="exp/public" queryName="getDefaultPeriod"/>
		<d:dataSet id="dataStore" loadData="false" modelName="report/amountAnalysis" />
	</d:initProcedure>

	<script type="text/javascript">
		function query() {
			dataStore.baseParams["period_id"]=queryForm.getData().period_id;
			dataStore.reload();
		}

		var yAxis = [ {
			name : '本期预算',
			field : 'buget_amount'
		} ,{
			name : '本期发生',
			color:'#D02090',
			field : 'emerge_amount'
		}];
		var xAxis = {
			name : '元',
			field : 'account_name'
		};
		Ext.onReady(query);
	</script>
	<body>
	    
		<d:form style="margin-bottom:0px" id="queryForm" labelWidth="90">
			<d:line columnWidth="0.33">
				<d:field name="period_id" editable="false" value="${periods[0].period}" required="true" anchor="85%" options="periodStore" valueField ="period_id" displayField="period_name" editor="combo" prompt="会计期间" >
					<d:event name="select" handle="query"/>
				</d:field>
				<d:field name="b" width="80" editor="button" prompt="查询" >
					<d:event name="click" handle="query"/>
				</d:field>
			</d:line>
		</d:form>
		
		<div style="width:55%;position:absolute;">
			<d:barChart style="margin-right:0px" valueSuffix="元" title="费用柱状图" rotation="-60" yAxis="yAxis" xAxis="xAxis" height="590" bindTarget="dataStore" />
		</div>		
		<div style="width:45%;position:absolute;top:0xp;left:55%;">
			<d:pieChart height="290" valueSuffix="元" title="本期预算饼图" displayField="account_name" valueField="buget_amount" bindTarget="dataStore" />
			<d:pieChart height="295" valueSuffix="元" title="本期发生饼图" displayField="account_name" valueField="emerge_amount" bindTarget="dataStore" />
		</div>
	</body>
</html>
