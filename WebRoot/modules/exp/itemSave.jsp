<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="dbfound-tags" prefix="d"%>

<d:controlBody>
	<d:execute modelName="exp/item" executeName="save" />
	<d:batchExecute modelName="exp/itemLine" sourcePath="param.lineDatas"></d:batchExecute>
</d:controlBody>