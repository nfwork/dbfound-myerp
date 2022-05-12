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
		
		function reset() {
			queryForm.reset();
		}
		
		function isCellEditable(col, row,name,record) {
			if (record.json && ( name == "account_code")) {
				return false;
			} else {
				return true;
			}
		}

	</script>
	<body>
		
		<d:initProcedure>
			<d:set name="code" value="ACCOUNTTYPE" scope="param"/>
	    	<d:dataSet id="accountTypeStore" modelName="fnd/sourceCode"/>
	    </d:initProcedure>
	    
		<d:form id="queryForm" title="查询条件" labelWidth="90">
			<d:line columnWidth="0.33">
				<d:field name="account_code" anchor="85%" editor="textfield" lovHeight="445" lovWidth="600" prompt="科目编码">
					 <d:event name="enter" handle="query"/>
				</d:field>
				<d:field name="account_name"  anchor="85%" editor="textfield" prompt="科目名称">
				   <d:event name="enter" handle="query"/>
				</d:field>
				<d:field name="account_type" anchor="85%" editor="combo" options="accountTypeStore" displayField="code_name" valueField="code_value" prompt="科目类型" >
					 <d:event name="select" handle="query"/>
				</d:field>
			</d:line>
		</d:form>
		
		<d:buttonGroup>
			<d:button id="query" title="查询" click="query" />
			<d:button title="重置" click="reset" />
		</d:buttonGroup>
		
		<d:grid id="listGrid" forceFit="true" pagerSize="20" autoQuery="true" title="费用科目列表" model="fnd/expAccount" height="$D.getFullHeight('listGrid')" isCellEditable="isCellEditable" queryForm="queryForm" >
			<d:toolBar>
				<d:gridButton type="add"/>
				<d:gridButton type="save"/>
			</d:toolBar>
			<d:columns>
				<d:column name="account_code" width="150" sortable="true" required="true" editor="textfield"  prompt="科目编码" />
				<d:column name="account_name" width="250" sortable="true" required="true" editor="textfield" prompt="科目名称" />
				<d:column name="account_type" required="true" width="150" editor="combo" options="accountTypeStore" displayField="code_name" valueField="code_value" prompt="科目类型" />
				<d:column name="priority" width="100" editor="numberfield" align="right" prompt="优先级" />
			</d:columns>
		</d:grid>
		
	</body>
</html>
