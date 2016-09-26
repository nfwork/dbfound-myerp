<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;">
<d:includeLibrary />
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap-theme.min.css">
<script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>
<script src="http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<style type="text/css">

.ext-strict .x-form-text {
    height: 24px;
}

</style>
</head>
<script type="text/javascript">
	function login() {
		if (loginForm.form.isValid()) {
			$D.request({
				url : 'sys/login.execute',
				param : loginForm.getData(),
				callback : function(obj) {
					if (obj.success == true) {
						parent.location.href = "mobile/menu.jsp";
					} else {
						parent.$D.showMessage(obj.message)
					}
				}
			});
		}
	}

	function reset() {
		loginForm.form.reset();
	}
</script>

<body>
	<div class="panel panel-primary">
		<div class="panel-heading">请登录</div>
		
		<div class="panel-body">
			<div class="top_table" style="width: 100%">
				<div class="top_table_leftbg">
					<div class="system_logo">
						<img src="images/relogin.jpg" width="100%" height="66">
					</div>
				</div>
			</div>
			<d:form id="loginForm" labelWidth="80" height="120">
				<d:line columnWidth="1">
					<d:field name="user_code" value="${cookie.user_code.value}" required="true" editor="textfield" prompt="用户名" />
				</d:line>
				<d:line columnWidth="1">
					<d:field name="password" required="true" editor="password" prompt="密码">
						<d:event name="enter" handle="login" />
					</d:field>
				</d:line>
				<d:toolBar>
					<d:formButton action="" title="登 录" beforeAction="login"></d:formButton>
					<d:formButton action="" title="重 置" beforeAction="reset"></d:formButton>
				</d:toolBar>
			</d:form>
			<script>
				loginForm.reset();
			</script>
		</div>
	</div>
</body>
</html>