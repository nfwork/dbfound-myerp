<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<d:includeLibrary />
	</head>
	<script type="text/javascript">

		function save(){
			$D.request({
				url:"fnd/expBook.execute!updateUserBook",
				param: dataForm.getData(),
				callback: function(){
					$D.showMessage("保存成功",function(){
						var window = parent.Ext.getCmp("update_window");
						window.close();
					});
				}
			})
		}

		function createBook(){
			$D.request({
				url:"fnd/expBook.execute!create",
				param: {
					user_code: dataForm.getData().user_code,
					book_name: dataForm.getData().book_name,
					account_list:[
						{account_name:"费用-生活开支",account_type:0, priority:10, display_in_home:1},
						{account_name:"费用-房租物业",account_type:0, priority:20, display_in_home:1},
						{account_name:"费用-水电燃气",account_type:0, priority:30, display_in_home:1},
						{account_name:"费用-其它开支",account_type:0, priority:40, display_in_home:1},
						{account_name:"我的现金",account_type:1, priority:50, display_in_home:0},
						{account_name:"我的存款",account_type:2, priority:60, display_in_home:0}
					]
				},
				callback: function(res){
					$D.showMessage(res.message,function(){
						var window = parent.Ext.getCmp("update_window");
						window.close();
					});
				}
			})
		}

	</script>
	<body>
		<d:initProcedure>
		    <d:dataSet id="bookStore" modelName="fnd/expBook" />
			<d:query modelName="fnd/expBook" queryName="getUserBook" rootPath="request.userBook"/>
	    </d:initProcedure>
	    
		<d:form id="dataForm" title="查询条件" labelWidth="140">
			<d:line columnWidth="0.9">
				<d:field name="user_code" value="${userBook[0].user_code}" readOnly="true" editable="false" anchor="75%"  editor="textfield"   prompt="用户编号" />
			</d:line>
			<d:line columnWidth="0.9">
				<d:field name="user_name" value="${userBook[0].user_name}" readOnly="true" editable="false" anchor="75%"  editor="textfield" prompt="用户名" />
			</d:line>
			<d:line columnWidth="0.9">
				<d:field name="book_id" value="${userBook[0].book_id}" editable="false" anchor="75%"  editor="combo" options="bookStore" displayField="book_name" valueField="book_id" prompt="选择已有账套" />
			</d:line>
			<d:line columnWidth="0.9">
				<d:field name="book_name" editor="textfield" prompt="为用户新创建账套：" anchor="75%"  />
			</d:line>
		</d:form>
		<d:buttonGroup align="center">
			<d:button title="保存账套设置" click="save"/>
			<d:button title="为用户创建新的账套" click="createBook" />
		</d:buttonGroup>
		

	</body>
</html>
