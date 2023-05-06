<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<d:includeLibrary />
		<jsp:include page="../base/floatBase.jsp"/>
	</head>
	<script type="text/javascript">
		function query() {
			listGrid.query();
		}

		function openDetailWindow(){
			var datas = listGrid.getSelectionsData(true);
			if(datas.length==0){
				$D.showMessage("必须选中一行数据");
				return;
			}
			var url = "modules/exp/bugetAmountDetail.jsp?period_id="+queryForm.getData().period_id+"&account_id="+datas[0].account_id;
			DBFound.open("update_window","本期添加",600,400,url);
		}
		
		function openAddWindow(){
			var datas = listGrid.getSelectionsData(true);
			if(datas.length==0){
				$D.showMessage("必须选中一行数据");
				return;
			}
			var url = "modules/exp/addBugetAmount.jsp?period_id="+queryForm.getData().period_id+"&account_id="+datas[0].account_id;
			DBFound.open("update_window","本期添加",600,450,url);
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
		    <d:dataSet id="periodStore" modelName="fnd/expPeriod" queryName="${periodStoreQueryName}" />
		    <d:query rootPath="request.periods" modelName="exp/public" queryName="getDefaultPeriod"/>
	    </d:initProcedure>
	    
		<d:form id="queryForm" title="查询条件" labelWidth="90">
			<d:line columnWidth="0.33">
				<d:field name="period_id" editable="false" value="${periods[0].period_id}" required="true" anchor="85%" options="periodStore" valueField ="period_id" displayField="period_name" editor="combo" prompt="会计期间" >
					<d:event name="select" handle="query"/>
				</d:field>
				<d:field name="b" width="80" editor="button" prompt="查询" >
					<d:event name="click" handle="query"/>
				</d:field>
			</d:line>
		</d:form>
		
		<d:grid id="listGrid" title="${gridTitle}" selectFirstRow="false" navBar="false" autoQuery="true" model="exp/amountManager" height="280" queryForm="queryForm" >
			<d:toolBar>
				<d:choose>
					<d:when test="${isQuery!='1'}">
						<d:gridButton icon="DBFoundUI/images/page_attach.png" title="预算管理" beforeAction="openAddWindow"/>
					</d:when>
					<d:otherwise>
						<d:gridButton icon="DBFoundUI/images/page_attach.png" title="预算明细" beforeAction="openDetailWindow"/>
					</d:otherwise>
				</d:choose>
			</d:toolBar>
			<d:columns>
				<d:column name="account_code" width="100" sortable="true" required="true" prompt="科目编码" />
				<d:column name="account_name" width="130" sortable="true" required="true" prompt="科目名称" />
				<d:column name="append_amount" width="100" align="right" prompt="本期预算" />
				<d:column name="emerge_amount" width="100" align="right" prompt="本期发生" />
				<d:column name="end_amount" renderer="getData" width="100" align="right" prompt="预算余额" />
			</d:columns>
		</d:grid>
		
		 <d:grid id="functionGrid" selectFirstRow="false" navBar="false" queryForm="queryForm" title="费用明细" queryUrl="exp/amountManager.query!getExpDetail" height="$D.getFullHeight('functionGrid')">
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
					queryForm.setData({account_id:account_id});
					functionGrid.query();
				}
			});
			
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
