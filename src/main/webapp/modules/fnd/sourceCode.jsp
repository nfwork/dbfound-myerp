<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<d:includeLibrary />
	</head>
	<script type="text/javascript">
		function query() {
			roleGrid.query();
		}
		
		function reset() {
			queryForm.reset();
		}
		
		function isCellEditable(col, row,name,record) {
			if (name == "code") {
				return false;
			} else {
				return true;
			}
		}

		var codeStore = new Ext.data.SimpleStore( {
			data : [ 
					 [ "ACCOUNTTYPE", "科目类型" ],
					 [ "DOWNTYPE", "下发类型" ]
				  ],
			fields : [ "code", "name" ]
		});

		function initData(record,grid){
			record.set("code",queryForm.getData().code);
		}
	</script>
	<body>
		<d:form id="queryForm" title="查询条件" labelWidth="90">
			<d:line columnWidth="0.33">
				<d:field name="code" required="true" anchor="85%" editor="combo" options="codeStore" displayField="name" valueField="code" prompt="用途编码类型">
				   <d:event name="select" handle="query"/>
				</d:field>
				<d:field name="code_value" anchor="85%" editor="textfield" lovHeight="445" lovWidth="600" prompt="用途编码值">
					 <d:event name="enter" handle="query"/>
				</d:field>
				<d:field name="code_name"  anchor="85%" editor="textfield" prompt="用途编码名称">
				   <d:event name="enter" handle="query"/>
				</d:field>
			</d:line>
		</d:form>
		
		<d:buttonGroup>
			<d:button id="query" title="查询" click="query" />
			<d:button title="重置" click="reset" />
		</d:buttonGroup>
		
		<d:grid id="roleGrid" selectFirstRow="false" title="用途编码列表" model="fnd/sourceCode" height="$D.getFullHeight('roleGrid')" pagerSize="20" isCellEditable="isCellEditable" queryForm="queryForm" >
			<d:toolBar>
				<d:gridButton type="add" afterAction="initData"/>
				<d:gridButton type="save"/>
				<d:gridButton type="delete"/>
			</d:toolBar>
			<d:columns>
				<d:column name="code" sortable="true" required="true"  editor="combo" options="codeStore" displayField="name" prompt="用途编码类型" />
				<d:column name="code_value" sortable="true" required="true" editor="textfield"  prompt="用途编码" />
				<d:column name="code_name" sortable="true" required="true" editor="textfield" prompt="编码名称" />
				<d:column name="priority" width="60" editor="numberfield" align="right" prompt="优先级" />
				<d:column name="last_update_user" width="80" sortable="true" required="true" prompt="最后处理人" />
				<d:column name="last_update_date" sortable="true" required="true" prompt="最后处理时间" />
			</d:columns>
		</d:grid>
		
	</body>
</html>
