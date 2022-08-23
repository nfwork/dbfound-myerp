package com.nfwork.erp.dto;

import java.util.ArrayList;
import java.util.List;

import com.nfwork.dbfound.dto.QueryResponseObject;

public class ReportResponseObject<T> extends QueryResponseObject<T> {

	private List<Column> columns = new ArrayList<>();

	public List<Column> getColumns() {
		return columns;
	}

	public void setColumns(List<Column> columns) {
		this.columns = columns;
	}
	
	
}
