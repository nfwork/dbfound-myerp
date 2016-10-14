<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="base.jsp" />
</head>

<body>
	<d:query rootPath="periodList" modelName="fnd/expPeriod" queryName="combo" />

	<div class="panel panel-primary" style="margin-bottom: 0px;">
		<div class="panel-heading"><b>MyERP-凭证管理</b></div>

		<div class="panel-body">
			<div class="form-group">
				<select id="preiod" class="form-control" data-style="common-select">
					<option value="">--全部期间--</option>
					<d:forEach var="preiod" items="${periodList }">
						<option selected="selected" value="${preiod.period_id }">${preiod.period_name}</option>
					</d:forEach>
				</select>
			</div>
			
			<div class="form-group">
				<input class="form-control" id="description" placeholder="凭证抬头">
			</div>
			
			<div class="btn-group form-group">
			  <a href="javascript:refresh()" class="btn btn-success" style="width:70px">查询</a>
			  <a href="mobile/itemDetailM.jsp" class="btn btn-success" style="width:100px">凭证登记(简)</a>
			  <a href="mobile/itemDetailMMult.jsp" class="btn btn-success" style="width:80px">凭证登记</a>
			  <a href="javascript:history.back()" class="btn btn-success" style="width:70px">返回</a>
			</div>
			
			<table id="table" data-id-field="id" data-side-pagination="server" data-height="350">
				<thead>
					<tr>
						<th data-width="25%" data-formatter="renerder" data-field="item_num" data-align="center">凭证号</th>
						<th data-width="27%" data-field="exp_time" data-align="center">费用日期</th>
						<th data-width="48%" data-field="description" data-align="left">凭证抬头</th>
					</tr>
				</thead>
			</table>

			<table id="detailTable" data-side-pagination="server" data-height="200">
				<thead>
					<tr>
						<th data-width="30%" data-field="account_name">科目名称</th>
						<th data-width="15%" data-field="dr_amount" data-align="center">借</th>
						<th data-width="15%" data-field="cr_amount" data-align="center">贷</th>
						<th data-width="40%" data-field="description" data-align="left">凭证描述</th>
					</tr>
				</thead>
			</table>
		</div>
	</div>

	<script type="text/javascript">
		var item_id = 0;
		
		function renerder(value,row,index){
			return "<a href='mobile/itemDetailMMult.jsp?item_id="+row.item_id+"'>"+value+"</a>"
		}

		$('#table').bootstrapTable({
			url : "exp/item.query",
			striped : true,
			pagination:true,
			contentType:"application/x-www-form-urlencoded",
			method: 'post',
			pageSize:5,
			responseHandler : tableResponseHandle,
			queryParams : function(params) {
				params.period_id = $("#preiod").val();
				params.description = $("#description").val();
				params.start= params.offset;
				return params;
			},
			onClickCell : function(field, value, row, element) {
				if(field=="item_num"){
					return;
				}
				item_id = row.item_id;
				$('#detailTable').bootstrapTable('refresh');
			},onLoadSuccess :function(){
				var a =$(".pull-left");
				//a.hide();
			}
		});
		
		$('#detailTable').bootstrapTable({
			url : "exp/itemLine.query",
			striped : true,
			contentType:"application/x-www-form-urlencoded",
			method: 'post',
			responseHandler : tableResponseHandle,
			queryParams : function(params) {
				params.period_id =  $("#preiod").val();;
				params.item_id = item_id;
				return params;
			},
		});
		
		function refresh(){
			item_id = 0;
			$('#table').bootstrapTable('refresh');
			$('#detailTable').bootstrapTable('refresh');
		}
		
		$('#preiod').change(refresh)
		
		$('#description').keydown(function(e){
			if(e.keyCode==13){
				refresh();
			}
		});
	</script>
</body>
</html>