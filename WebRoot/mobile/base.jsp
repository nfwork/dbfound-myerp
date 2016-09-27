<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<base href="${basePath}"/>
<meta name="viewport" content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;">
<link rel="stylesheet" href="${basePath}bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="${basePath}bootstrap/bootstrap-theme.min.css">
<script src="${basePath}DBFoundUI/chart/jquery.min.js"></script>
<script src="${basePath}bootstrap/bootstrap.min.js"></script>
<link rel="stylesheet" href="${basePath}bootstrap/bootstrap-table.min.css">
<script src="${basePath}bootstrap/bootstrap-table.min.js"></script>
<script src="${basePath}bootstrap/bootstrap-table-zh-CN.min.js"></script>

<title>MyERP财务系统</title>
<script type="text/javascript">
	function add(num1,num2){
       var r1,r2,m;
       try{r1 = num1.toString().split('.')[1].length;}catch(e){r1 = 0;}
       try{r2=num2.toString().split(".")[1].length;}catch(e){r2=0;}
       m=Math.pow(10,Math.max(r1,r2));
       return Math.round(num1*m+num2*m)/m;
    }
</script>