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
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="combo" />
		    <d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod"/>
		    <d:dataSet id="dataStore" loadData="false" modelName="report/amountAnalysis" />
	 </d:initProcedure>

	<script type="text/javascript">
		function query() {
			dataStore.baseParams["period_id"]="${periods[0].period}";
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
		<div style="width:55%;position:absolute;">
			<d:barChart style="margin-right:0px" valueSuffix="元" title="本期费用柱状图" rotation="-60" yAxis="yAxis" xAxis="xAxis" height="590" bindTarget="dataStore" />
		</div>		
		<div style="width:45%;position:absolute;top:0xp;left:55%;">
			<d:pieChart height="290" valueSuffix="元" title="本期预算分布饼图" displayField="account_name" valueField="buget_amount" bindTarget="dataStore" />
			<d:pieChart height="295" valueSuffix="元" title="本期发生分布饼图" displayField="account_name" valueField="emerge_amount" bindTarget="dataStore" />
		</div>
	</body>
</html>
