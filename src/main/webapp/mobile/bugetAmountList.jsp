<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="base.jsp" />
</head>


<body>
	<d:query rootPath="request.periods" modelName="exp/public" queryName="getDefaultPeriod" />
	<d:query rootPath="request.periodList" modelName="fnd/expPeriod" queryName="comboAll" />
			
	<div class="panel panel-primary" style="margin-bottom: 0px;">
		<div class="panel-heading"><b>MyERP-费用明细</b></div>

		<div class="panel-body">
			<div class="form-group">
				<select id="preiod" class="form-control" data-style="common-select" >
					<d:forEach var="preiod" items="${periodList }">
						<option 
						<d:if test="${preiod.period_id == periods[0].period}">selected="selected" </d:if>
						value="${preiod.period_id }">${preiod.period_name}</option>
					</d:forEach>
				</select>
			</div>
			
			<div class="btn-group form-group">
			  <a href="javascript:refresh()" class="btn btn-success" style="width:80px">查询</a>
			  <a href="javascript:history.back()" class="btn btn-success" style="width:80px">返回</a>
			</div>

			<table id="table" data-id-field="id" data-side-pagination="server" data-height="230">
				<thead>
					<tr>
						<th data-width="60%" data-field="account_name">科目名称</th>
						<th data-width="40%" data-field="emerge_amount" data-align="right">本月发生</th>
					</tr>
				</thead>
			</table>
			<div style="padding-top: 10px"></div>
			<table id="detailTable" data-side-pagination="server" data-height="200">
				<thead>
					<tr>
						<th data-width="27%" data-field="exp_time">费用日期</th>
						<th data-width="15%" data-field="dr_amount" data-align="center">借</th>
						<th data-width="15%" data-field="cr_amount" data-align="center">贷</th>
						<th data-width="43%" data-field="description" data-align="left">凭证描述</th>
					</tr>
				</thead>
			</table>
		</div>
	</div>

	<script type="text/javascript">
		var account_id = 0;

		$('#table').bootstrapTable({
			url : "exp/amountManager.query",
			striped : true,
			responseHandler : function(res) {
				
				var items = res.datas;
				var append_amount = 0;
				var emerge_amount = 0;
				var end_amount = 0;
				for (var i = 0; i < items.length; i++) {
					append_amount = add(append_amount, items[i].append_amount);
					emerge_amount = add(emerge_amount, items[i].emerge_amount);
					end_amount = add(end_amount, items[i].end_amount);
				}
				var json = {};
				json.append_amount = "" + append_amount;
				json.emerge_amount = "" + emerge_amount;
				if (end_amount < 0) {
					json.end_amount = "" + "<b><font color='red'>"
							+ end_amount + "</font></b>";
				} else {
					json.end_amount = "" + end_amount;
				}
				json.account_name="合计："
				
				items.push(json);
				
				return tableResponseHandle(res);
			},
			queryParams : function(params) {
				params.period_id = $("#preiod").val();
				return params;
			},
			onClickRow : function(row, element) {
				account_id = row.account_id;
				$('#detailTable').bootstrapTable('refresh');
			}
		});

		var height= $(window).height()-410;
		if(height<150){
			height=150;
		}
		$('#detailTable').bootstrapTable({
			url : "report/accountAmountQuery.query!getExpDetail",
			striped : true,
			height : height,
			responseHandler : tableResponseHandle,
			queryParams : function(params) {
				params.period_id =  $("#preiod").val();;
				params.account_id = account_id;
				return params;
			},
		});
		
		function refresh(){
			account_id = 0;
			$('#table').bootstrapTable('refresh');
			$('#detailTable').bootstrapTable('refresh');
		}
		
		$('#preiod').change(refresh);
	</script>
</body>
</html>