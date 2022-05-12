<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="base.jsp" />
</head>

<body>
	<div class="panel panel-primary" style="margin-bottom: 0px">
		<div class="panel-heading">
			<b>MyERP-请登录</b>
		</div>

		<div class="panel-body">
			<form role="form">
				<div class="form-group form-group-lg">
					<label for="exampleInputEmail1">用户名</label> <input type="text" value="${cookie.user_code.value}" class="form-control" id="username"
						placeholder="username">
				</div>
				<div class="form-group form-group-lg">
					<label for="exampleInputPassword1">密码</label> <input type="password" class="form-control" id="password" placeholder="Password">
				</div>

				<button type="button" id="login" class="btn btn-success btn-lg btn-block">登陆</button>
				<button type="reset" style="margin-top: 10px" class="btn btn-info btn-lg btn-block">重置</button>
			</form>
		</div>
		<script>
			$(function() {
				var $btn = $("#login");
				$btn.on("click", function() {
					var username = $("#username").val();
					var password = $("#password").val();
					$.ajax({
						url : "sys/login.execute",
						data : {
							user_code : username,
							password : password
						},
						dataType : "json",
						type : "post",
						success : function(res) {
							if (res.success) {
								parent.location.href = "mobile/menu.jsp";
							} else {
								alert(res.message)
							}
						}
					})
				})
			})
		</script>
	</div>
</body>
</html>