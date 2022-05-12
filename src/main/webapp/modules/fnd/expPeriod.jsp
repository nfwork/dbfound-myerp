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
			if (record.json && ( name == "period_code")) {
				return false;
			}else if(name == "status"){
				return false;
			} else {
				return true;
			}
		}

		var statusStore = new Ext.data.SimpleStore( {
			data : [ [ "Y", "打开" ], [ "N", "关闭" ], [ "A", "未打开" ]],
			fields : [ "status_code", "status_name" ]
		});

		function initData(record,grid){
			record.set("status","A");
		}

		function reload(){
			listGrid.getStore().reload();
		}
	</script>
	<body>
		<d:form id="queryForm" title="查询条件" labelWidth="90">
			<d:line columnWidth="0.33">
				<d:field name="period_code" anchor="85%" editor="textfield" lovHeight="445" lovWidth="600" prompt="科目编码">
					 <d:event name="enter" handle="query"/>
				</d:field>
				<d:field name="period_name"  anchor="85%" editor="textfield" prompt="科目名称">
				   <d:event name="enter" handle="query"/>
				</d:field>
				<d:field name="status" anchor="85%" editor="combo" options="statusStore" displayField="status_name" valueField="status_code"  prompt="状态" />
			</d:line>
		</d:form>
		
		<d:buttonGroup>
			<d:button id="query" title="查询" click="query" />
			<d:button title="重置" click="reset" />
		</d:buttonGroup>
		
		<d:grid id="listGrid" forceFit="true" pagerSize="20" autoQuery="true" title="会计期间列表" model="fnd/expPeriod" height="$D.getFullHeight('listGrid')" isCellEditable="isCellEditable" queryForm="queryForm" >
			<d:toolBar>
				<d:gridButton type="add" afterAction="initData"/>
				<d:gridButton type="save"/>
				<d:gridButton title="打开" icon="DBFoundUI/images/update.gif" action="fnd/expPeriod.execute!open" afterAction="reload" />
				<d:gridButton title="关闭" icon="DBFoundUI/images/update.gif" action="fnd/expPeriod.execute!close" afterAction="reload"/>
			</d:toolBar>
			<d:columns>
				<d:column name="period_code" width="150" sortable="true" required="true" editor="textfield"  prompt="期间编码(YYYYMM)" />
				<d:column name="period_name" width="250" sortable="true" required="true" editor="textfield" prompt="期间名称" />
				<d:column name="priority" width="120" editor="numberfield" align="right" prompt="优先级" />
				<d:column name="status" required="true" width="120" align="center" editor="combo" options="statusStore" displayField="status_name" valueField="status_code" prompt="状态" />
			</d:columns>
		</d:grid>
		
	</body>
</html>
