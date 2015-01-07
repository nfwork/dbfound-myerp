<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@page import="com.nfwork.dbfound.core.Context"%>
<%@page import="com.nfwork.dbfound.util.JsonUtil"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<d:includeLibrary />
	</head>
	
	<script type="text/javascript">
		var ischanged = false;
		
		function save() {
			$D.request( {
				url : 'exp/amountManager.execute!add',
				param : itemForm.getData(),
				callback : function(obj) {
					$D.showMessage(obj.message,function(){
						ischanged = true;
						bugetGrid.query();
						itemForm.reset();
					});
				}
			});
		}
		
		function close() {
			if (parent) {
				var window = parent.Ext.getCmp("update_window");
				if(ischanged){
					parent.query();
				}
				window.close();
			}
		}
	
	</script>
	<body style="overflow:hidden">
	    <d:initProcedure>
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="combo" />
		    <d:dataSet id="accountStore" modelName="fnd/expAccount"  />
	    </d:initProcedure>
	    <d:grid id="bugetGrid" height="160" selectFirstRow="false" queryUrl="exp/amountManager.query!detail?period_id=${param.period_id}&account_id=${param.account_id}" autoQuery="true" navBar="false">
	    	<d:columns>
	    		<d:column name="amount" width="70" prompt="金额" />
	    		<d:column name="add_user" width="70" prompt="添加人" />
	    		<d:column name="add_time" width="120" prompt="添加时间" />
	    		<d:column name="description" width="200" prompt="说明" />
	    	</d:columns>
	    </d:grid>
		<d:form id="itemForm" labelWidth="120">
			<d:line columnWidth="1">
			    <d:field name="period_id" readOnly="true" editable="false" required="true" value="${param.period_id}" options="periodStore" valueField ="period_id" displayField="period_name" width="210" editor="combo" prompt="会计期间" />
			</d:line>
			<d:line columnWidth="1">
			    <d:field name="account_id" readOnly="true" editable="false" required="true" value="${param.account_id}" options="accountStore" valueField ="account_id" displayField="account_name" width="210" editor="combo" prompt="费用科目" />
			</d:line>
			<d:line columnWidth="1">
			    <d:field name="amount" required="true" width="210" editor="numberfield" prompt="添加额" />
			</d:line>
			<d:line columnWidth="1">
				<d:field name="description" required="true" height="80" editor="textarea" prompt="说明" />
			</d:line>
		</d:form>
		<d:buttonGroup align="center">
			<d:button title="添加" icon="DBFoundUI/images/save.gif" click="save" />
			<d:button title="返回" click="close" ></d:button>
		</d:buttonGroup>
	</body>
</html>
