package com.nfwork.erp.mq;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nfwork.erp.dto.ReportResponseObject;

import java.util.List;
import java.util.Map;

public class MQResponseObject<T> extends ReportResponseObject<T> {

    private boolean success;

    private String message;

    private String code;

    @JsonProperty("outParam")
    private Map<String,Object> outParam;

    private List<Map<String,Object>> columns;

    private List<T> datas;

    @JsonProperty("totalCounts")
    private long totalCounts = -1;

    @Override
    public boolean isSuccess() {
        return success;
    }

    @Override
    public void setSuccess(boolean success) {
        this.success = success;
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public Map<String, Object> getOutParam() {
        return outParam;
    }

    @Override
    public void setOutParam(Map<String, Object> outParam) {
        this.outParam = outParam;
    }

    @Override
    public List<Map<String, Object>> getColumns() {
        return columns;
    }

    @Override
    public void setColumns(List<Map<String, Object>> columns) {
        this.columns = columns;
    }

    @Override
    public List<T> getDatas() {
        return datas;
    }

    @Override
    public void setDatas(List<T> datas) {
        this.datas = datas;
    }

    @Override
    public long getTotalCounts() {
        return totalCounts;
    }

    @Override
    public void setTotalCounts(long totalCounts) {
        this.totalCounts = totalCounts;
    }
}
