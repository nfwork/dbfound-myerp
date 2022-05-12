<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<d:includeLibrary />
	</head>
	<script type="text/javascript">
		function query() {
			listGrid.query();
		}

		function getData(value,meta,record){
			if(value<0){
				return "<b><font color='red'>"+value+"</font></b>";
			}else{
				return value;
			}
		}

	</script>
	<body>
	    
		<d:initProcedure>
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="comboAll" />
		    <d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod"/>
	    </d:initProcedure>
	    
		<d:form id="queryForm" title="查询条件" labelWidth="90">
			<d:line columnWidth="0.33">
				<d:field name="period_id" editable="false" value="${periods[0].period}" required="true" anchor="85%" options="periodStore" valueField ="period_id" displayField="period_name" editor="combo" prompt="会计期间" >
					<d:event name="select" handle="query"/>
				</d:field>
				<d:field name="b" width="80" editor="button" prompt="查询" >
					<d:event name="click" handle="query"/>
				</d:field>
			</d:line>
		</d:form>

		<d:grid title="科目" id="listGrid" queryForm="queryForm" navBar="false" autoQuery="true" model="report/accountAmountQuery" height="300" >
			<d:columns>
				<d:column name="account_code" width="100" sortable="true" required="true" prompt="科目编码" />
				<d:column name="account_name" width="130" sortable="true" required="true" prompt="科目名称" />
				<d:column name="remaind_amount" renderer="getData" width="100" align="right" prompt="期初余额" />
				<d:column name="emerge_amount" renderer="getData" width="100" align="right" prompt="本期增加" />
				<d:column name="end_amount" renderer="getData" width="100" align="right" prompt="期末余额" />
			</d:columns>
		</d:grid>
		
		<d:grid  title="凭证明细" id="functionGrid" queryForm="queryForm" navBar="false" selectFirstRow="false" queryUrl="report/accountAmountQuery.query!getExpDetail" height="$D.getFullHeight('functionGrid')">
			<d:columns>
				<d:column name="item_num" sortable="true" prompt="凭证号" width="90" />
				<d:column name="account_name" sortable="true" prompt="费用科目" width="110" />
				<d:column name="period_name" sortable="true" prompt="会计期间" width="90" />
				<d:column name="exp_time" sortable="true" prompt="费用日期" width="90" />
				<d:column name="dr_amount" align="right" sortable="true" prompt="借金金额" width="80" />
				<d:column name="cr_amount" align="right" sortable="true" prompt="贷方金额" width="80" />
				<d:column name="description" prompt="凭证描述" width="250" />
				<d:column name="regiest_user" sortable="true" prompt="登记人" width="70" />
				<d:column name="regist_time" sortable="true" prompt="登记时间" width="120" />
			</d:columns>
		</d:grid>
		
		<script type="text/javascript">
		
			listGrid.getSelectionModel().on("rowselect",function(){
				var account_id = listGrid.getCurrentRecordData().account_id;
				if(account_id!=null){
					functionGrid.getStore().baseParams.account_id=account_id;
					functionGrid.query();
				}
			});
		</script>
	</body>
</html>
