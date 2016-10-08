<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="base.jsp" />
</head>

<body>

	<d:query rootPath="periods" modelName="exp/public" queryName="getDefaultPeriod" />
	<d:query rootPath="periodList" modelName="fnd/expPeriod" queryName="combo" />
	<d:query rootPath="accounList" modelName="fnd/expAccount" />

	<div class="panel panel-primary" style="margin-bottom: 0px;">
		<div class="panel-heading">凭证登记</div>

		<div class="panel-body">
			<form id="registForm" role="form">
				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">凭证编号：</span> <input class="form-control" id="item_num" name="item_num" readonly="readonly" placeholder="系统自动生成">
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">登记用户：</span> <input class="form-control" id="add_user" name="add_user" readonly="readonly"
						value="${sessionScope.user_name}">
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">会计期间：</span> <select id="period_id" name="period_id" class="form-control">
						<d:forEach var="preiod" items="${periodList }">
							<option selected="selected" value="${preiod.period_id }">${preiod.period_name}</option>
						</d:forEach>
					</select>
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">费用日期：</span> <input type="date" class="form-control" id="exp_time" name="exp_time" value="${periods[0].exp_time}">
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">借方科目：</span> <select id="dr_account_id" name="dr_account_id" class="form-control">
						<option></option>
						<d:forEach var="account" items="${accounList }">
							<option value="${account.account_id }">${account.account_name }</option>
						</d:forEach>
					</select>
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">贷方科目：</span> <select id="cr_account_id" name="cr_account_id" class="form-control">
						<option></option>
						<d:forEach var="account" items="${accounList }">
							<option value="${account.account_id }">${account.account_name }</option>
						</d:forEach>
					</select>
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">费用金额：</span> <input class="form-control" type="number" id="amount" name="amount">
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">凭证抬头：</span>
					<textarea class="form-control" id="description" name="description" style="height: 60px"></textarea>
				</div>

				<div class="btn-group form-group">
				  <button id="login" class="btn btn-success" style="width:80px">提交</button>
				  <button type="reset" class="btn btn-success" style="width:80px">重置</button>
				  <button onclick="history.back()" class="btn btn-success" style="width:80px">返回</button>
				</div>
			</form>
		</div>
		<script>
			$(function() {
				var $btn = $("#login");
				$btn.on("click", function() {
					var username = $("#username").val();
					var password = $("#password").val();
					$.ajax({
						url : "mobile/item.do!save",
						data : $('#registForm').serialize(),
						dataType : "json",
						type : "post",
						success : function(res) {
							if (res.success) {
								alert("凭证录入成功！")
								history.back();
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