<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<d:includeLibrary />
		<jsp:include page="../base/floatBase.jsp"/>
	</head>
	<script type="text/javascript">
		function query() {
			listGrid.query();
		}
		function formReset() {
			queryForm.reset();
			setDefaultValue();
		}
	</script>
	<body>
		 <d:dataStore id="listData" fields="c" url="report/periodAmountReport.query" autoLoad="true" />
	     <d:grid id="listGrid" title="科目期间汇总查询" queryUrl="" rowNumber="false" navBar="false" selectable="false" autoQuery="false" height="$D.getFullHeight('listGrid')-5">
			<d:columns>
				<d:column name="c" sortable="true" prompt="期间" width="100" />
				<d:column align="right" name="c1" sortable="true" hidden="true" prompt="c1" width="100" />
				<d:column align="right" name="c2" sortable="true" hidden="true" prompt="c2" width="100" />
				<d:column align="right" name="c3" sortable="true" hidden="true" prompt="c3" width="100" />
				<d:column align="right" name="c4" sortable="true" hidden="true" prompt="c4" width="100" />
				<d:column align="right" name="c5" sortable="true" hidden="true" prompt="c5" width="100" />
				<d:column align="right" name="c6" sortable="true" hidden="true" prompt="c6" width="100" />
				<d:column align="right" name="c7" sortable="true" hidden="true" prompt="c7" width="100" />
				<d:column align="right" name="c8" sortable="true" hidden="true" prompt="c8" width="100" />
				<d:column align="right" name="c9" sortable="true" hidden="true" prompt="c9" width="100" />
				<d:column align="right" name="c10" sortable="true" hidden="true" prompt="c10" width="100" />
				<d:column align="right" name="c11" sortable="true" hidden="true" prompt="c11" width="100" />
				<d:column align="right" name="c12" sortable="true" hidden="true" prompt="c12" width="100" />
				<d:column align="right" name="c13" sortable="true" hidden="true" prompt="c13" width="100" />
				<d:column align="right" name="c14" sortable="true" hidden="true" prompt="c14" width="100" />
				<d:column align="right" name="c15" sortable="true" hidden="true" prompt="c15" width="100" />
				<d:column align="right" name="c16" sortable="true" hidden="true" prompt="c16" width="100" />
				<d:column align="right" name="c17" sortable="true" hidden="true" prompt="c17" width="100" />
				<d:column align="right" name="c18" sortable="true" hidden="true" prompt="c18" width="100" />
				<d:column align="right" name="c19" sortable="true" hidden="true" prompt="c19" width="100" />
				<d:column align="right" name="c20" sortable="true" hidden="true" prompt="c20" width="100" />
				<d:column align="right" name="c21" sortable="true" hidden="true" prompt="c21" width="100" />
				<d:column align="right" name="c22" sortable="true" hidden="true" prompt="c22" width="100" />
				<d:column align="right" name="c23" sortable="true" hidden="true" prompt="c23" width="100" />
				<d:column align="right" name="c24" sortable="true" hidden="true" prompt="c24" width="100" />
				<d:column align="right" name="c25" sortable="true" hidden="true" prompt="c25" width="100" />
				<d:column align="right" name="c26" sortable="true" hidden="true" prompt="c26" width="100" />
				<d:column align="right" name="c27" sortable="true" hidden="true" prompt="c27" width="100" />
				<d:column align="right" name="c28" sortable="true" hidden="true" prompt="c28" width="100" />
				<d:column align="right" name="c29" sortable="true" hidden="true" prompt="c29" width="100" />
				<d:column align="right" name="c30" sortable="true" hidden="true" prompt="c30" width="100" />
			</d:columns>
		</d:grid>
		
		<%--后面代码 无须修改 --%>
	    <script type="text/javascript">

	    	<%--初始化查询表单默认值--%>
			Ext.get("listGrid").mask("正在加载中");
			listData.on("load",function(store){
				listGrid.getStore().loadData({datas:[]});

	    		var columns = store.reader.meta.reader.jsonData.columns;
    		 	var cm = listGrid.getColumnModel();
			   
    		 	<%--先隐藏所以的列--%>
			    var length= cm.columns.length;
				for(var i=0;i<length;i++){
					var index = cm.getDataIndex(i);
					if(index!=""&&index!="c"){
						cm.setHidden(i,true);
					}
				}

				<%--显示查询的新列--%>
			    for(var i=0;i<columns.length;i++){
				    var column = columns[i];
			    	var index = cm.findColumnIndex(column.index);
				    cm.setColumnHeader(index,column.name);
				    cm.setHidden(index,false);
					cm.moveColumn(index,i+1);
			    }

			    <%--添加合计行--%>
			    var datas = store.reader.meta.reader.jsonData.datas;
				var json={c:'合计'};
				for(var i=0;i<datas.length;i++){
					for(var j=0;j<columns.length;j++){
						var column = columns[j];
						var c = json[column.index];
						if(c==null){
							c=0;
							json[column.index]=c;
						}
						var cc= datas[i][column.index];
						if(cc>0){
							json[column.index] = add(c,cc);
						}
					}
				}
				datas.push(json);
				listGrid.getStore().loadData({datas:datas});
				Ext.get("listGrid").unmask();
			});
		</script>
	</body>
</html>
