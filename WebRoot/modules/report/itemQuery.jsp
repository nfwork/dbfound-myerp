<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<d:set name="isQuery" value="1" scope="request" />
<d:set name="periodStoreQueryName" value="comboAll" scope="request" />
<d:set name="gridTitle" value="凭证头" scope="request" />
<jsp:include page="../exp/itemList.jsp"></jsp:include>