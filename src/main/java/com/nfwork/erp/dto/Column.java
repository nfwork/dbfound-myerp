package com.nfwork.erp.dto;

public class Column implements Comparable<Column> {

	String index;
	String name;
	Integer priority;

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	@Override
	public int compareTo(Column o) {
		 return this.priority - o.priority;  
	}

}
