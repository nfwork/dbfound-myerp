package com.nfwork.erp.dto;

public class Column implements Comparable<Column> {

	String jsName;
	String javaName;
	Integer priority;

	public String getJsName() {
		return jsName;
	}

	public void setJsName(String jsName) {
		this.jsName = jsName;
	}

	public String getJavaName() {
		return javaName;
	}

	public void setJavaName(String javaName) {
		this.javaName = javaName;
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
