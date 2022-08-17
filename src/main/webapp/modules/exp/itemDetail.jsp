<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@page import="com.nfwork.dbfound.core.Context"%>
<%@page import="com.nfwork.dbfound.util.JsonUtil"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<d:includeLibrary />
		<jsp:include page="../base/floatBase.jsp"/>
	</head>
	
	<script type="text/javascript">
		function save() {

			debugger
			Ext.getCmp("saveBt").disable();

			if (itemForm.form.isValid()==false) {
				$D.showWarning("验证通不过");
				Ext.getCmp("saveBt").enable();
				return;
			}
			
			var items = lineGrid.getStore().data.items;
			
			if (items.length==0) {
				$D.showWarning("无凭证行");
				Ext.getCmp("saveBt").enable();
				return;
			}
			
			if ($D.validate(items,lineGrid)==false){
				Ext.getCmp("saveBt").enable();
				return;
			}
				
			var dr_amount = 0;
			var cr_amount = 0;
			for(var i=0;i<items.length;i++){
				d_amount = items[i].get("dr_amount");
				if(d_amount!=""){
					dr_amount = add(dr_amount ,d_amount);
				}
				c_amount = items[i].get("cr_amount");
				if(c_amount!=""){
					cr_amount = add(cr_amount,c_amount);
				}
			}
			if(dr_amount!=cr_amount){
				$D.showWarning("借贷不平，借方金额："+dr_amount+"，贷方金额："+cr_amount+"，请确认");
				Ext.getCmp("saveBt").enable();
				return;
			}
			
			var data = itemForm.getData();
			data.lines = lineGrid.getModifiedData();
			
			$D.request( {
				url : 'exp/item.execute!saveHeaderAndLine',
				param : itemForm.getData(),
				callback : function(obj) {
					Ext.getCmp("saveBt").enable();
					$D.showMessage(obj.message,function(){
						if(obj.success){
							if(data.item_num && data.item_num !=""){
								parent.reload();
							}else{
								parent.moveLast();
							}
							close();
						}
					});
				}
			});
		}
		
		function close() {
			if (parent) {
				var window = parent.Ext.getCmp("update_window");
				window.close();
			}
		}

		function addLine(){
			lineGrid.addLine();
		}

		var rowNum;
		function showMenu(grid,row,e){
			rowNum = row;
			menu.showAt([e.getPageX(),e.getPageY()]);     
			e.stopEvent();
		}
		
		function deleteLine(){
			var store = lineGrid.getStore();
			var record = store.getAt(rowNum);
			if(record.json){
				$D.showMessage("已经保存的行不能清除！");
			}else{
				record.commit();
				store.remove(record);
			}
		}
		
	</script>
	<body style="overflow:hidden">
	    <d:initProcedure>
	    	<d:dataSet id="itemStore" modelName="exp/item" queryName="getDeatil"/>
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="combo" />
		    <d:dataSet id="accountStore" modelName="fnd/expAccount"  />
		    <d:query rootPath="request.periods" modelName="exp/public" queryName="getDefaultPeriod"/>
	    </d:initProcedure>
	    
	    <d:menu id="menu">
	    	<d:menuItem icon="DBFoundUI/images/delete.png" title="清除多余行" click="deleteLine"/>
	    </d:menu>
	    
		<d:form id="itemForm" bindTarget="itemStore" labelWidth="120">
			<d:line columnWidth="1">
			    <d:field name="item_num" readOnly="true" emptyText="系统自动生成" width="210" editor="textfield" prompt="凭证号" />
			</d:line>
			<d:line columnWidth="1">
			    <d:field name="add_user" readOnly="true" value="${sessionScope.user_name}" width="210" editor="textfield" prompt="登记人" />
			</d:line>
			<d:line columnWidth="1">
			    <d:field id="periodField" editable="false" name="period_id" value="${periods[0].period}" required="true" options="periodStore" valueField ="period_id" displayField="period_name" width="210" editor="combo" prompt="会计期间" />
			</d:line>
			<d:line columnWidth="1">
			    <d:field id="expTimeField" name="exp_time" value="${periods[0].exp_time}" required="true" width="210" editor="datefield" prompt="费用发生日期" />
			</d:line>
			<d:line columnWidth="1">
				<d:field name="description" required="true" height="80" editor="textarea" prompt="费用抬头" />
			</d:line>
		</d:form>
		
		<d:buttonGroup>
			<d:button title="新增行" click="addLine" />
			<d:button title="保存" id="saveBt" click="save" />
			<d:button title="返回" click="close" />
		</d:buttonGroup>
		
		<d:grid id="lineGrid" navBar="false" selectable="false" pagerSize="10" queryForm="itemForm" model="exp/itemLine" height="$D.getFullHeight('lineGrid')">
			<d:columns>
				<d:column name="account_id" editable="false" required="true" options="accountStore" width="140" valueField ="account_id" displayField="account_name" editor="combo"  sortable="true" prompt="科目名称" />
				<d:column name="dr_amount" editor="numberfield" align="right" sortable="true" prompt="借方金额（元）" width="100" />
				<d:column name="cr_amount" editor="numberfield" align="right" sortable="true" prompt="贷方金额（元）" width="100" />
				<d:column name="description" editor="textfield" sortable="true" prompt="行描述" width="220" />
				<d:column name="regiest_user" hidden="true" sortable="true" prompt="登记人" width="100" />
				<d:column name="regist_time" hidden="true" sortable="true" prompt="登记时间" width="120" />
			</d:columns>
			<d:events>
				<d:event name="rowcontextmenu" handle="showMenu"/>
			</d:events>
		</d:grid>
		
		<d:if test="${param.item_id!=null}">
			<script type="text/javascript">
				Ext.onReady(function(){
					lineGrid.query();
					$D.setFieldReadOnly("periodField",true);
					$D.setFieldReadOnly("expTimeField",true);
				});
			</script>
	    </d:if>
	</body>
</html>
