<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="base.jsp" />
</head>

<body>
	<div class="panel panel-primary">
		<div class="panel-heading" style="-moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px;">请登录</div>

		<div class="panel-body">
			<div class="form-group">
				<select class="selectpicker" data-live-search="true">
					<option>Mustard</option>
					<option>Ketchup</option>
					<option>Relish</option>
				</select>
			</div>

			<table id="table" data-id-field="id" data-side-pagination="server">
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
			url : "sys/user.query",
			pagination : true,
			pageSize : 2,
			responseHandler : function(res) {
				var r = {};
				r.total = res.totalCounts;
				r.rows = res.datas;
				return r;
			},
			queryParams : function(params) {
				params.start = params.offset;
				return params;
			}
		});
	</script>
</body>
</html>