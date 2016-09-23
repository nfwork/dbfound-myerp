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

		var index = 0;
	
		function query() {
			itemGrid.query();
		}
		function formReset() {
			queryForm.reset();
		}
		function openAddWindow(){
			var url = "mobile/itemDetail.jsp";
			location.href= url;
		}
		function openUpdateWindow(){
			var datas = itemGrid.getSelectionsData(true);
			if(datas.length==0){
				$D.showMessage("必须选中一行数据");
				return;
			}
			var url = "mobile/itemDetail.jsp?item_id="+datas[0].item_id;
			location.href= url;
		}
		function reload(){
			itemGrid.getStore().reload();
		}
		function moveLast(){
			index = -1;
			var bar = itemGrid.getBottomToolbar();
			if(bar.store.data.length>0){
				bar.moveLast();
			}else{
				bar.moveFirst();
			}
		}
	</script>

<body>
	<div class="panel panel-primary">
		<div class="panel-heading">凭证列表</div>
		
		
		 <d:initProcedure>
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="${periodStoreQueryName}" />
		    <d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod"/>
	    </d:initProcedure>
	    
	    <d:form id="queryForm" title="查询条件" labelWidth="80">
			<d:line columnWidth="1">
				<d:choose>
					<d:when test="${isQuery=='0'}">
						<d:field name="period_id" editable="false" required="true" value="${periods[0].period}" options="periodStore" valueField ="period_id" displayField="period_name" anchor="95%" editor="combo" prompt="会计期间" />
					</d:when>
					<d:otherwise>
						<d:field name="period_id" editable="false" options="periodStore" valueField ="period_id" displayField="period_name" anchor="95%" editor="combo" prompt="会计期间" />
					</d:otherwise>
				</d:choose>
			</d:line>
			<d:line columnWidth="1">
				<d:field editor="numberfield" name="item_num" prompt="凭证号" anchor="95%">
					<d:event name="enter" handle="query"></d:event>
				</d:field>
			</d:line>
			<d:line columnWidth="1">
				<d:field editor="textfield" name="description" prompt="凭证抬头" anchor="95%">
					<d:event name="enter" handle="query"></d:event>
				</d:field>
			</d:line>
		</d:form>
		
		<d:buttonGroup>
			<d:button id="query" title="查询" click="query" />
			<d:button title="重置" click="formReset" />
		</d:buttonGroup>
		
	    <d:grid id="itemGrid" title="${gridTitle}" singleSelect="true" selectFirstRow="false" pagerSize="5" queryForm="queryForm" model="exp/item" autoQuery="true" height="200">
			<d:if test="${isQuery=='0'}">
				<d:toolBar>
				   <d:gridButton icon="DBFoundUI/images/add.gif" title="新增" beforeAction="openAddWindow"/>
				   <d:gridButton icon="DBFoundUI/images/page_attach.png" title="修改" beforeAction="openUpdateWindow" />
				   <d:gridButton type="delete" afterAction="reload"/>
				</d:toolBar>
			</d:if>
			<d:columns>
				<d:column name="item_num" sortable="true" prompt="凭证号" width="80" />
				<d:column name="exp_time" sortable="true" prompt="费用日期" width="100" />
				<d:column name="description" prompt="凭证抬头" width="200" />
			</d:columns>
		</d:grid>
		
		<d:grid id="lineGrid" navBar="false" selectFirstRow="false" queryForm="queryForm" title="凭证明细" pagerSize="10" model="exp/itemLine" height="140">
			<d:columns>
				<d:column name="account_name" sortable="true" prompt="科目名称" width="250" />
				<d:column name="dr_amount" align="right" sortable="true" prompt="借" width="130" />
				<d:column name="cr_amount" align="right" sortable="true" prompt="贷" width="130" />
				<d:column name="description" prompt="行描述" width="280" />
			</d:columns>
		</d:grid>
	    
	    <script type="text/javascript">
	    	itemGrid.getSelectionModel().on("rowselect",function(){
				var item_id = itemGrid.getCurrentRecordData().item_id;
				if(item_id!=null){
					queryForm.setData({item_id:item_id});
					lineGrid.query();
				}
			});
			itemGrid.on("rowclick",function(grid,rowIndex){index = rowIndex;});
	    	itemGrid.getStore().on("load",function(){
		    	if(index == -1){
		    		itemGrid.getSelectionModel().selectLastRow();
		    	}else{
	    			itemGrid.getSelectionModel().selectRow(index);
		    	}
		    });
		</script>
	</div>
</body>
</html>