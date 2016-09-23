<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<d:set name="isQuery" value="0" scope="request" />
<d:set name="periodStoreQueryName" value="combo" scope="request" />
<d:set name="gridTitle" value="" scope="request" />
<jsp:include page="itemQuery.jsp"></jsp:include>