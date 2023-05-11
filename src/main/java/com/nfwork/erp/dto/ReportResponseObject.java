package com.nfwork.erp.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.nfwork.dbfound.dto.QueryResponseObject;

public class ReportResponseObject<T> extends QueryResponseObject<T> {

	private List<Map<String,Object>> columns = new ArrayList<>();

	public List<Map<String,Object>> getColumns() {
		return columns;
	}

	public void setColumns(List<Map<String,Object>> columns) {
		this.columns = columns;
	}
	
	
}
