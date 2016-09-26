<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html style="overflow: hidden;height: 100%">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap-theme.min.css">
<script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>
<script src="http://issues.wenzhixin.net.cn/bootstrap-table/assets/bootstrap/js/bootstrap.min.js"></script>

<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/bootstrap-table.min.css">
<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/bootstrap-table.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/locale/bootstrap-table-zh-CN.min.js"></script>
<jsp:include page="../modules/base/floatBase.jsp" />
</head>


<body style="overflow: hidden;height: 100%">
	<d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod" />
	<d:query rootPath="periodList" modelName="fnd/expPeriod" queryName="comboAll" />
			
	<div class="panel panel-primary" style="height:100%;">
		<div class="panel-heading">费用明细</div>

		<div class="panel-body">
			<div class="form-group">
				<select id="preiod" class="form-control" >
					<d:forEach var="preiod" items="${periodList }">
						<option 
						<d:if test="${preiod.period_id == periods[0].period}">selected="selected" </d:if>
						value="${preiod.period_id }">${preiod.period_name}</option>
					</d:forEach>
				</select>
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
						<th data-width="30%" data-field="exp_time">费用日期</th>
						<th data-width="15%" data-field="dr_amount" data-align="center">借</th>
						<th data-width="15%" data-field="cr_amount" data-align="center">贷</th>
						<th data-width="40%" data-field="description" data-align="left">凭证描述</th>
					</tr>
				</thead>
			</table>
		</div>
	</div>

	<script type="text/javascript">
		var account_id = 0;

		$('#table').bootstrapTable({
			url : "../exp/amountManager.query",
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
				
				
				var r = {};
				r.total = res.totalCounts;
				r.rows = res.datas;
				return r;
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

		var height= getFullHeight()-362;
		$('#detailTable').bootstrapTable({
			url : "../report/accountAmountQuery.query!getExpDetail",
			striped : true,
			height:height,
			responseHandler : function(res) {
				var r = {};
				r.total = res.totalCounts;
				r.rows = res.datas;
				return r;
			},
			queryParams : function(params) {
				params.period_id =  $("#preiod").val();;
				params.account_id = account_id;
				return params;
			},
		});
		
		$('#preiod').change(function(){
			account_id = 0;
			$('#table').bootstrapTable('refresh');
			$('#detailTable').bootstrapTable('refresh');
		})
	</script>
</body>
</html>