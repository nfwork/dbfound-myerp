<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap-theme.min.css">
<script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>
<script src="http://issues.wenzhixin.net.cn/bootstrap-table/assets/bootstrap/js/bootstrap.min.js"></script>

<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/bootstrap-table.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/bootstrap-table.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/locale/bootstrap-table-zh-CN.min.js"></script>
<jsp:include page="../modules/base/floatBase.jsp" />
</head>

<body>
	<d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod" />
	<d:query rootPath="periodList" modelName="fnd/expPeriod" queryName="comboAll" />
			
	<div class="panel panel-primary" style="margin-bottom: 0px;">
		<div class="panel-heading">科目余额</div>

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
			
			<div class="btn-group form-group">
			  <a href="javascript:refresh()" class="btn btn-success" style="width:80px">查询</a>
			  <a href="javascript:history.back()" class="btn btn-success" style="width:80px">返回</a>
			</div>

			<table id="table" data-id-field="id" data-side-pagination="server" data-height="250">
				<thead>
					<tr>
						<th data-width="40%" data-field="account_name">科目名称</th>
						<th data-width="20%" data-field="remaind_amount" data-align="right">期初余额</th>
						<th data-width="20%" data-field="emerge_amount" data-align="right">本期增加</th>
						<th data-width="20%" data-field="end_amount" data-align="right">期末余额</th>
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
			url : "../report/accountAmountQuery.query",
			striped : true,
			responseHandler : function(res) {
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

		$('#detailTable').bootstrapTable({
			url : "../report/accountAmountQuery.query!getExpDetail",
			striped : true,
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
		
		function refresh(){
			account_id = 0;
			$('#table').bootstrapTable('refresh');
			$('#detailTable').bootstrapTable('refresh');
		}
		
		$('#preiod').change(refresh)
	</script>
</body>
</html>