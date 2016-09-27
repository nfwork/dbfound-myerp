<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html style="">
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


<body>
	<d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod" />
	<d:query rootPath="periodList" modelName="fnd/expPeriod" queryName="comboAll" />

	<div class="panel panel-primary" style="margin-bottom: 0px;">
		<div class="panel-heading">凭证管理</div>

		<div class="panel-body">
			<div class="form-group">
				<select id="preiod" class="form-control">
					<d:forEach var="preiod" items="${periodList }">
						<d:if test="${preiod.period_id == periods[0].period}">
							<option selected="selected" value="${preiod.period_id }">${preiod.period_name}</option>
						</d:if>
					</d:forEach>
				</select>
			</div>
			
			<div class="form-group">
				<input class="form-control" id="description" placeholder="凭证抬头">
			</div>
			
			<div class="btn-group form-group">
			  <a href="javascript:refresh()" class="btn btn-success" style="width:70px">查询</a>
			  <a href="itemDetailM.jsp" class="btn btn-success" style="width:100px">凭证登记(简)</a>
			  <a href="itemDetail.jsp" class="btn btn-success" style="width:80px">凭证登记</a>
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
			return "<a href='itemDetail.jsp?item_id="+row.item_id+"'>"+value+"</a>"
		}

		$('#table').bootstrapTable({
			url : "../exp/item.query",
			striped : true,
			pagination:true,
			contentType:"application/x-www-form-urlencoded",
			method: 'post',
			pageSize:5,
			responseHandler : function(res) {
				var r = {};
				r.total = res.totalCounts;
				r.rows = res.datas;
				return r;
			},
			queryParams : function(params) {
				params.period_id = $("#preiod").val();
				params.description = $("#description").val();
				params.start= params.offset;
				return params;
			},
			onClickRow : function(row, element) {
				item_id = row.item_id;
				$('#detailTable').bootstrapTable('refresh');
			},onLoadSuccess :function(){
				var a =$(".pull-left");
				//a.hide();
			}
		});
		
		$('#detailTable').bootstrapTable({
			url : "../exp/itemLine.query",
			striped : true,
			contentType:"application/x-www-form-urlencoded",
			method: 'post',
			responseHandler : function(res) {
				var r = {};
				r.total = res.totalCounts;
				r.rows = res.datas;
				return r;
			},
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