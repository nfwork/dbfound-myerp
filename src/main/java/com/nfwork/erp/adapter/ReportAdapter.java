package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.adapter.QueryAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.dbfound.util.DataUtil;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.WebWriter;
import com.nfwork.erp.dto.ReportResponseObject;

import java.util.*;

public class ReportAdapter implements QueryAdapter<Map<String,Object>> {

    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<Map<String,Object>> responseObject) {
        String rowField = params.get("row_field").getStringValue();
        String columnField = params.get("column_field").getStringValue();
        String valueField = params.get("value_field").getStringValue();
        String columnPriorityField = params.get("column_priority_field").getStringValue();
        String rowPriorityField = params.get("row_priority_field").getStringValue();

        List<Map<String,Object>> dataList = responseObject.getDatas();

        List<Map<String,Object>> rows = new ArrayList<>();
        Map<String, Map<String,Object>> rowsMap = new HashMap<>();

        Map<String, Map<String,Object>> columnsMap = new HashMap<>();
        List< Map<String,Object>> columns = new ArrayList<>();

        // 得到行名 列名 缓存数据
        for (Map<?,?> map : dataList) {
            String rowName = map.get(rowField).toString();
            Map<String, Object> row = rowsMap.get(rowName);
            if ( row == null) {
                row = new HashMap<>();
                row.put("c",rowName);
                Integer rowPriority = DataUtil.intValue(map.get(rowPriorityField));
                if(rowPriority == null){
                    rowPriority = 9999999;
                }
                row.put(rowPriorityField,rowPriority);
                rows.add(row);
                rowsMap.put(rowName, row);
            }

            String colName = map.get(columnField).toString();
            Map<String,Object> column = columnsMap.get(colName);
            if (column == null) {
                column = new HashMap<>();
                column.put("name",colName);
                column.put("index","c" + (columns.size()+1));
                Integer columnPriority = DataUtil.intValue(map.get(columnPriorityField));
                if(columnPriority == null){
                    columnPriority = 9999999;
                }
                column.put(columnPriorityField, columnPriority);

                columnsMap.put(colName, column);
                columns.add(column);
            }

            row.put(column.get("index").toString(),map.get(valueField));
        }

        columns.sort(Comparator.comparing(o -> (Integer)o.get(columnPriorityField)));
        rows.sort(Comparator.comparing(o -> (Integer)o.get(rowPriorityField)));

        context.setOutMessage(false);
        ReportResponseObject<Map<String,Object>> object = new ReportResponseObject<>();
        object.setSuccess(true);
        object.setDatas(rows);
        object.setTotalCounts(rows.size());
        object.setColumns(columns);
        WebWriter.jsonWriter(context.response, JsonUtil.beanToJson(object));
    }
}
