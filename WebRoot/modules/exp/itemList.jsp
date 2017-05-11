<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<d:includeLibrary />
	</head>
	<script type="text/javascript">

		var index = 0;
	
		function query() {
			itemGrid.query();
		}
		function formReset() {
			queryForm.reset();
		}
		function openAddWindow(){
			var url = "modules/exp/itemDetail.jsp";
			DBFound.open("update_window","费用明细",750,500,url);
		}
		function openUpdateWindow(){
			var datas = itemGrid.getSelectionsData(true);
			if(datas.length==0){
				$D.showMessage("必须选中一行数据");
				return;
			}
			var url = "modules/exp/itemDetail.jsp?item_id="+datas[0].item_id;
			DBFound.open("update_window","费用明细",750,500,url);
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
	     <d:initProcedure>
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="${periodStoreQueryName}" />
		    <d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod"/>
		    <d:dataSet id="accountStore" modelName="fnd/expAccount"  />
	    </d:initProcedure>
	    
	    <d:form id="queryForm" title="查询条件" labelWidth="100">
			<d:line columnWidth="0.25">
				<d:choose>
					<d:when test="${isQuery!='1'}">
						<d:field name="period_id" editable="false" required="true" value="${periods[0].period}" options="periodStore" valueField ="period_id" displayField="period_name" anchor="95%" editor="combo" prompt="会计期间" />
					</d:when>
					<d:otherwise>
						<d:field name="period_id" editable="false" options="periodStore" valueField ="period_id" displayField="period_name" anchor="95%" editor="combo" prompt="会计期间" />
					</d:otherwise>
				</d:choose>
				<d:field editor="numberfield" name="item_num" prompt="凭证号" anchor="95%">
					<d:event name="enter" handle="query"></d:event>
				</d:field>
				<d:field editor="textfield" name="description" prompt="凭证抬头" anchor="95%">
					<d:event name="enter" handle="query"></d:event>
				</d:field>
			</d:line>
			<d:line columnWidth="0.25">
				<d:field name="account_id" anchor="95%" editable="false" options="accountStore" valueField ="account_id" displayField="account_name" editor="combo"  prompt="科目名称" />
				<d:field name="timefrom" anchor="95%" editor="datefield" prompt="费用日期从" />
				<d:field name="timeto" anchor="95%" editor="datefield" prompt="费用日期到" />
			</d:line>
		</d:form>
		
		<d:buttonGroup>
			<d:button id="query" title="查询" click="query" />
			<d:button title="重置" click="formReset" />
		</d:buttonGroup>
		
	    <d:grid id="itemGrid" title="${gridTitle}" singleSelect="true" selectFirstRow="false" pagerSize="10" queryForm="queryForm" model="exp/item" autoQuery="true" height="310">
			<d:if test="${isQuery!='1'}">
				<d:toolBar>
				   <d:gridButton icon="DBFoundUI/images/add.gif" title="新增" beforeAction="openAddWindow"/>
				   <d:gridButton icon="DBFoundUI/images/page_attach.png" title="修改" beforeAction="openUpdateWindow" />
				   <d:gridButton type="delete" afterAction="reload"/>
				   <d:gridButton type="excel" />
				</d:toolBar>
			</d:if>
			<d:columns>
				<d:column name="item_num" sortable="true" prompt="凭证号" width="80" />
				<d:column name="period_name" sortable="true" prompt="会计期间" width="80" />
				<d:column name="exp_time" sortable="true" prompt="费用日期" width="100" />
				<d:column name="description" prompt="凭证抬头" width="300" />
				<d:column name="regiest_user" sortable="true" prompt="登记人" width="100" />
				<d:column name="regist_time" sortable="true" prompt="登记时间" width="120" />
			</d:columns>
		</d:grid>
		
		<d:grid id="lineGrid" navBar="false" selectFirstRow="false" queryForm="queryForm" title="凭证明细" pagerSize="10" model="exp/itemLine" height="$D.getFullHeight('lineGrid')">
			<d:columns>
				<d:column name="account_name" sortable="true" prompt="科目名称" width="150" />
				<d:column name="dr_amount" align="right" sortable="true" prompt="借方金额（元）" width="130" />
				<d:column name="cr_amount" align="right" sortable="true" prompt="贷方金额（元）" width="130" />
				<d:column name="description" prompt="行描述" width="400" />
				<d:column name="regiest_user" sortable="true" prompt="登记人" width="130" />
				<d:column name="regist_time" sortable="true" prompt="登记时间" width="150" />
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
	</body>
</html>
