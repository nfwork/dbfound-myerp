<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="base.jsp" />
</head>

<body>

	<d:query rootPath="request.periods" modelName="exp/public" queryName="getDefaultPeriod" />
	<d:query rootPath="request.periodList" modelName="fnd/expPeriod" queryName="combo" />
	<d:query rootPath="request.accounList" modelName="fnd/expAccount" />

	<d:query rootPath="request.itemList" modelName="exp/item" queryName="getDeatil" />

	<div class="panel panel-primary" style="margin-bottom: 0px">
		<div class="panel-heading">
			<b>MyERP-凭证登记</b>
		</div>

		<div class="panel-body">
			<form id="registForm" role="form">
				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">凭证编号：</span> <input class="form-control" value="${itemList[0].item_num}" id="item_num" name="item_num"
						readonly="readonly" placeholder="系统自动生成">
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">登记用户：</span> <input class="form-control" id="add_user" name="add_user" readonly="readonly"
						value="${empty itemList ? sessionScope.user_name : itemList[0].add_user}">
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">会计期间：</span> <select id="period_id" name="period_id" class="form-control" data-style="common-select">
						<option value="">-请选择-</option>
						<d:forEach var="preiod" items="${periodList }">
							<option <d:if test="${preiod.period_id ==(empty itemList ? periods[0].period : itemList[0].period_id) }">selected="selected" </d:if>
								value="${preiod.period_id }">${preiod.period_name}</option>
						</d:forEach>
					</select>
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">费用日期：</span> <input type="date" class="form-control" id="exp_time" name="exp_time"
						value="${empty itemList ? periods[0].exp_time : itemList[0].exp_time}">
				</div>

				<div class="input-group" style="margin-bottom: 10px;">
					<span class="input-group-addon">凭证抬头：</span>
					<textarea class="form-control" id="ht" name="description" style="height: 80px">${itemList[0].description }</textarea>
				</div>

				<div class="btn-group form-group">
					<button type="button" onclick="addLine()" class="btn btn-success" style="width: 80px">新增行</button>
					<button onclick="saveData()" type="button" class="btn btn-success" style="width: 80px">提交</button>
					<button onclick="history.back()" class="btn btn-success" style="width: 80px">返回</button>
				</div>
			</form>

			<table id="detailTable" data-side-pagination="server" data-height="200">
				<thead>
					<tr>
						<th data-width="30%" data-formatter="renerder" data-field="account_name">科目名称</th>
						<th data-width="15%" data-field="dr_amount" data-align="center">借</th>
						<th data-width="15%" data-field="cr_amount" data-align="center">贷</th>
						<th data-width="40%" data-field="description" data-align="left">凭证描述</th>
					</tr>
				</thead>
			</table>
		</div>

		<!-- 新建modal窗口 -->
		<div class="modal fade" id="modal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
						</button>
						<h4 class="modal-title">
							<font color="#428bca"><b>凭证行明细</b> </font>
						</h4>
					</div>
					<div class="modal-body">
						<form id="addForm" name="addForm" role="form">
							<div class="input-group" style="margin-bottom: 10px;">
								<span class="input-group-addon">科&#12288;目：</span> <select id="account_id" name="account_id" class="form-control" data-style="common-select">
									<option value="">-请选择-</option>
									<d:forEach var="account" items="${accounList }">
										<option value="${account.account_id }">${account.account_name }</option>
									</d:forEach>
								</select>
							</div>

							<div class="input-group" style="margin-bottom: 10px;">
								<span class="input-group-addon">借金额：</span> <input step="0.1" min="0.0" class="form-control" type="number" id="dr_amount" name="dr_amount">
							</div>

							<div class="input-group" style="margin-bottom: 10px;">
								<span class="input-group-addon">贷金额：</span> <input step="0.1" min="0.0" class="form-control" type="number" id="cr_amount" name="cr_amount">
							</div>

							<div class="input-group" style="margin-bottom: 10px;">
								<span class="input-group-addon">行描述：</span> <input class="form-control" id="dinput" name="description"></input>
							</div>
						</form>

					</div>
					<div class="modal-footer" style="text-align: center">
						<button type="button" style="width: 80px" onclick="addData()" class="btn btn-primary">确定</button>
						<button type="button" style="width: 80px" class="btn btn-default" data-dismiss="modal">关闭</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script>
		var item_id = "${param.item_id}";
		var data = [];
		var dataIndex = -1;

		function modalShow() {
			$("#modal").modal().css({
				"margin-top" : function() {
					return 30;
				}
			});
		}

		function addLine() {
			modalShow();
			var form = $('#addForm')[0];
			form.reset();
			$('select').selectpicker('render');

			dataIndex = -1;
		}

		function updateLine(index) {
			modalShow();
			dataIndex = index;
			$("#cr_amount").val(data[dataIndex].cr_amount);
			$("#dr_amount").val(data[dataIndex].dr_amount);
			$("#dinput").val(data[dataIndex].description);
			$("#account_id").val(data[dataIndex].account_id);
			$('select').selectpicker('render');
		}

		function renerder(value, row, index) {
			return "<a href='javascript:updateLine(" + index + ")'>" + value
					+ "</a>"
		}

		function addData() {
			var cr_amount = $("#cr_amount").val();
			var dr_amount = $("#dr_amount").val();
			var description = $("#dinput").val();
			var account_id = $("#account_id").val();
			var account_name = $("#account_id").find("option:selected").text();
			if (account_id == "") {
				alert("科目不能为空！")
				return;
			}
			if (cr_amount == "" && dr_amount == "") {
				alert("借贷不能同时为空！")
				return;
			}

			if (cr_amount != "" && dr_amount != "") {
				alert("借贷不能同时有值！")
				return;
			}

			if (dataIndex == -1) {
				var lineData = {
					cr_amount : cr_amount,
					dr_amount : dr_amount,
					description : description,
					account_id : account_id,
					account_name : account_name
				};
				data.push(lineData);
			} else {
				data[dataIndex].cr_amount = cr_amount;
				data[dataIndex].dr_amount = dr_amount;
				data[dataIndex].description = description;
				data[dataIndex].account_id = account_id;
				data[dataIndex].account_name = account_name;
			}

			var res = {
				rows : data,
				total : data.length
			};
			debugger;
			$('#detailTable').bootstrapTable('load', res);
			$("#modal").modal("hide");
		}

		function saveData() {
			var dr_amount = 0;
			var cr_amount = 0;
			for (var i = 0; i < data.length; i++) {
				d_amount = data[i].dr_amount;
				if (d_amount != "") {
					dr_amount = add(dr_amount, d_amount);
				}
				c_amount = data[i].cr_amount;
				if (c_amount != "") {
					cr_amount = add(cr_amount, c_amount);
				}
			}
			if (dr_amount != cr_amount) {
				alert("借贷不平，借方金额：" + dr_amount + "，贷方金额：" + cr_amount + "，请确认");
				return;
			}

			var exp_time = $("#exp_time").val();
			var period_id = $("#period_id").val();
			var description = $("#ht").val();

			$.ajax({
				url : "mobile/item.do!saveBatch",
				data : {
					GridData : JSON.stringify(data),
					period_id : period_id,
					exp_time : exp_time,
					description : description,
					item_id : item_id
				},
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
		}

		//初始化凭证明细table
		var height = $(window).height() - 385;
		if (height < 150) {
			height = 150;
		}
		$('#detailTable').bootstrapTable({
			url : "exp/itemLine.query",
			striped : true,
			height : height,
			contentType : "application/x-www-form-urlencoded",
			method : 'post',
			dataType : "json",
			responseHandler : function(res) {
				if (res.datas && res.datas.length > 0) {
					data = res.datas;
				}
				return tableResponseHandle(res);
			},
			queryParams : function(params) {
				params.period_id = $("#preiod").val();
				params.item_id = item_id;
				return params;
			},
		});
	</script>

</body>
</html>