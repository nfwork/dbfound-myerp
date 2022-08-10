<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML>
<html>
	<head>
		<d:includeLibrary />
		<script type="text/javascript" src="DBFoundUI/chart/jquery.min.js"></script>
		<script src="DBFoundUI/chart/highcharts.js"></script>
		<jsp:include page="../base/floatBase.jsp"/>
	</head>
	<script type="text/javascript">
		function query() {
			listGrid.query();
		}
		
		function reset() {
			queryForm.reset();
		}
		
		function openAddWindow(){
			var datas = listGrid.getSelectionsData(true);
			if(datas.length==0){
				$D.showMessage("必须选中一行数据");
				return;
			}
			var url = "modules/exp/addAmount.jsp?period_id="+queryForm.getData().period_id+"&account_id="+datas[0].account_id;
			DBFound.open("update_window","费用明细",500,350,url,query);
		}

		function getData(value,meta,record){
			if(value<0){
				return "<b><font color='red'>"+value+"</font></b>";
			}else{
				return value;
			}
		}

		var yAxis = [{
			name : '本期预算',
			field : 'append_amount'
		} ,{
			name : '本期发生',
			color:'#D02090',
			field : 'emerge_amount'
		}];
		var xAxis = {
			name : '元',
			field : 'account_name'
		};
	</script>
	<body>
		<d:initProcedure>
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="comboAll" />
		    <d:query rootPath="request.periods" modelName="exp/public" queryName="getDefaultPeriod"/>
	    </d:initProcedure>
	    
		<d:form id="queryForm" labelWidth="90">
			<d:line columnWidth="0.33">
				<d:field name="period_id" editable="false" value="${periods[0].period}" required="true" anchor="85%" options="periodStore" valueField ="period_id" displayField="period_name" editor="combo" prompt="会计期间" >
					<d:event name="select" handle="query"/>
				</d:field>
				<d:field name="b" width="80" editor="button" prompt="查询" >
					<d:event name="click" handle="query"/>
				</d:field>
			</d:line>
		</d:form>
		
		<div style="margin:5px" id="chart_div"></div>
		
		<d:grid id="listGrid" navBar="false" autoQuery="true" title="费用科目列表" model="exp/amountManager" height="290" queryForm="queryForm" >
			<d:columns>
				<d:column name="account_code" width="100" sortable="true" required="true" prompt="科目编码" />
				<d:column name="account_name" width="130" sortable="true" required="true" prompt="科目名称" />
				<d:column name="append_amount" width="100" align="right" prompt="本期预算" />
				<d:column name="emerge_amount" width="100" align="right" prompt="本期发生" />
				<d:column name="end_amount" renderer="getData" width="100" align="right" prompt="预算余额" />
			</d:columns>
		</d:grid>
		
		<d:lineChart id="chart" title="费用分析折线图" valueSuffix="元" yAxis="yAxis" xAxis="xAxis" height="300" bindTarget="listGrid.getStore()" />
		
		<script type="text/javascript">
			listGrid.getStore().on("load",function(){
				var items = this.data.items;
				var append_amount = 0;
				var emerge_amount = 0;
				var end_amount = 0;
				for(var i=0;i<items.length;i++){
					append_amount = add(append_amount , items[i].get("append_amount"));
					emerge_amount = add(emerge_amount , items[i].get("emerge_amount"));
					end_amount = add(end_amount , items[i].get("end_amount"));
				}
				var json={};
				json.append_amount="合计："+append_amount;
				json.emerge_amount="合计："+emerge_amount;
				if(end_amount<0){
					json.end_amount="合计："+"<b><font color='red'>"+end_amount+"</font></b>";
				}else{
					json.end_amount="合计："+end_amount;
				}
				listGrid.addLine(json,true);
				listGrid.getSelectionModel().selectFirstRow()
			});
		</script>
	</body>
</html>
