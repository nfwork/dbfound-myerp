package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.adapter.QueryAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.dbfound.util.DataUtil;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.WebWriter;
import com.nfwork.erp.dto.Column;
import com.nfwork.erp.dto.ReportResponseObject;

import java.util.*;

public class ReportAdapter implements QueryAdapter<Map<String,Object>> {

    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<Map<String,Object>> responseObject) {
        String rowColumnName = params.get("rowColumnName").getStringValue();
        String columnColumnName = params.get("columnColumnName").getStringValue();
        String keyColumnName = params.get("keyColumnName").getStringValue();
        String priorityColumnName = params.get("priorityColumnName").getStringValue();

        List<Map<String,Object>> dataList = responseObject.getDatas();

        List<String> rows = new ArrayList<>();
        Map<String, Integer> rowsMap = new HashMap<>();

        Map<String, Integer> columnsMap = new HashMap<>();
        List<Column> columns = new ArrayList<>();

        Map<String, Object> bufferData = new HashMap<>();

        // 得到行名 列名 缓存数据
        for (Map<?,?> map : dataList) {
            String row = map.get(rowColumnName).toString();
            if (rowsMap.get(row) == null) {
                rows.add(row);
                rowsMap.put(row, 1);
            }

            String name = map.get(columnColumnName).toString();
            if (columnsMap.get(name) == null) {
                Column column = new Column();
                column.setName(name);
                column.setPriority(DataUtil.intValue(map.get(priorityColumnName)));
                if (column.getPriority() == null) {
                    column.setPriority(999999);
                }
                columnsMap.put(name, 1);
                columns.add(column);
            }

            bufferData.put(row + name, map.get(keyColumnName));
        }

        Collections.sort(columns);
        for (int i = 0; i < columns.size(); i++) {
            columns.get(i).setIndex("c" + (i+1));
        }

        // 重新装载数据
        List<Map<String,Object>> newDatas = new ArrayList<>();
        for (String row : rows) {
            Map<String,Object> newData = new HashMap<>();
            newData.put("c", row);
            newDatas.add(newData);
            for (Column column : columns) {
                Object value = getValue(bufferData, row, column.getName());
                newData.put(column.getIndex(), value);
            }
        }

        context.setOutMessage(false);
        ReportResponseObject<Map<String,Object>> object = new ReportResponseObject<>();
        object.setSuccess(true);
        object.setDatas(newDatas);
        object.setTotalCounts(newDatas.size());
        object.setColumns(columns);
        WebWriter.jsonWriter(context.response, JsonUtil.beanToJson(object));
    }

    private Object getValue(Map<String, Object> dataMap, String row, String column) {
        return dataMap.get(row + column);
    }

}
