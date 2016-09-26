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

</head>

<body>
	<div class="panel panel-primary">
		<div class="panel-heading" style="-moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px;">请登录</div>

		<div class="panel-body">
			<table id="table"  data-id-field="id" data-side-pagination="server">
				<thead>
					<tr>
						<th data-field="user_code" data-sortable="true">用户编号</th>
						<th data-field="user_name">用户名</th>
						<th data-field="create_date">创建时间</th>
					</tr>
				</thead>
			</table>
		</div>
	</div>
	
	<script type="text/javascript">
		$('#table').bootstrapTable({
			url:"../sys/user.query",
			pagination:true,
			pageSize:2,
			responseHandler:function(res){
				var r={};
				r.total = res.totalCounts;
				r.rows = res.datas;
				return r;
			},
			queryParams:function(params){
				params.start= params.offset;
				return params;
			}
		});
	</script>
</body>
</html>