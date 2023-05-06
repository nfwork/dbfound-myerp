<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE HTML>
<html>
<head>
<d:includeLibrary />
<meta name="viewport" content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
<script src="http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<jsp:include page="../modules/base/floatBase.jsp"/>

<style type="text/css">
.ext-strict .x-form-text {
    height: 21px;
}
.ext-strict .ext-webkit .x-small-editor .x-form-text {
    height: 19px!important;
}
</style>

<script type="text/javascript">
		function save() {
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
							history.back();
						}
					});
				}
			});
		}
		
		function close() {
			location.href="mobile/menu.jsp"
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
		
		function back(){
			history.back();
		}
	</script>
</head>

<body>
	<div class="panel panel-primary">
		<div class="panel-heading">凭证登记</div>
		
		 <d:initProcedure>
	    	<d:dataSet id="itemStore" modelName="exp/item" queryName="getDeatil"/>
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="combo" />
		    <d:dataSet id="accountStore" modelName="fnd/expAccount"  />
		    <d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod"/>
	    </d:initProcedure>
	    
	    <d:menu id="menu">
	    	<d:menuItem icon="DBFoundUI/images/delete.png" title="清除多余行" click="deleteLine"/>
	    </d:menu>
	    
		<d:form id="itemForm" bindTarget="itemStore" labelWidth="100">
			<d:line columnWidth="1">
			    <d:field name="item_num" anchor="0.9" readOnly="true" emptyText="系统自动生成" editor="textfield" prompt="凭证号" />
			</d:line>
			<d:line columnWidth="1">
			    <d:field name="add_user" anchor="0.9" readOnly="true" value="${sessionScope.user_name}" editor="textfield" prompt="登记人" />
			</d:line>
			<d:line columnWidth="1">
			    <d:field id="periodField" anchor="0.9" editable="false" name="period_id" value="${periods[0].period_id}" required="true" options="periodStore" valueField ="period_id" displayField="period_name" editor="combo" prompt="会计期间" />
			</d:line>
			<d:line columnWidth="1">
			    <d:field id="expTimeField" anchor="0.9" name="exp_time" value="${periods[0].exp_time}" required="true" editor="datefield" prompt="费用发生日期" />
			</d:line>
			<d:line columnWidth="1">
				<d:field name="description" anchor="0.9" required="true" height="80" editor="textarea" prompt="费用抬头" />
			</d:line>
		</d:form>
		
		<d:buttonGroup>
			<d:button title="新增行" click="addLine" />
			<d:button title="保存" id="saveBt" click="save" />
			<d:button title="返回" click="back" />
		</d:buttonGroup>
		
		<d:grid id="lineGrid" navBar="false" forceFit="true" selectable="false" pagerSize="10" queryForm="itemForm" model="exp/itemLine" height="$D.getFullHeight('lineGrid')-20">
			<d:columns>
				<d:column name="account_id" editable="false" required="true" options="accountStore" width="140" valueField ="account_id" displayField="account_name" editor="combo"  sortable="true" prompt="科目名称" />
				<d:column name="dr_amount" editor="numberfield" align="right" sortable="true" prompt="借方金额（元）" width="100" />
				<d:column name="cr_amount" editor="numberfield" align="right" sortable="true" prompt="贷方金额（元）" width="100" />
				<d:column name="description" editor="textfield" sortable="true" prompt="行描述" width="220" />
			</d:columns>
			<d:events>
				<d:event name="rowcontextmenu" handle="showMenu"></d:event>
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
	</div>
</body>
</html>