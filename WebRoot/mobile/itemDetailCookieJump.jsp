<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>
<d:set name="item_id" value="${cookie.item_id.value}" scope="param"></d:set>
<jsp:forward page="itemDetailMMult.jsp?item_id=${cookie.item_id.value}"></jsp:forward>