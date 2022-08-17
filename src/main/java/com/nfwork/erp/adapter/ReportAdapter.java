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

public class ReportAdapter implements QueryAdapter<Map> {

    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<Map> responseObject) {
        String rowColumnName = params.get("rowColumnName").getStringValue();
        String columnColumnName = params.get("columnColumnName").getStringValue();
        String keyColumnName = params.get("keyColumnName").getStringValue();
        String priorityCloumnName = params.get("priorityColumnName").getStringValue();

        List<Map> datas = responseObject.getDatas();

        List<String> rows = new ArrayList<String>();
        Map<String, Integer> rowsMap = new HashMap<String, Integer>();

        Map<String, Integer> columnsMap = new HashMap<String, Integer>();
        List<Column> columns = new ArrayList<Column>();

        Map<String, Object> bufferDatas = new HashMap<String, Object>();

        // 得到行名 列名 缓存数据
        for (Map map : datas) {
            String row = map.get(rowColumnName).toString();
            if (rowsMap.get(row) == null) {
                rows.add(row);
                rowsMap.put(row, 1);
            }

            String javaName = map.get(columnColumnName).toString();
            if (columnsMap.get(javaName) == null) {
                Column column = new Column();
                column.setJavaName(javaName);
                column.setPriority(DataUtil.intValue(map.get(priorityCloumnName)));
                if (column.getPriority() == null) {
                    column.setPriority(999999);
                }
                columnsMap.put(javaName, 1);
                columns.add(column);
            }

            bufferDatas.put(row + javaName, map.get(keyColumnName));
        }

        Collections.sort(columns);
        for (int i = 0; i < columns.size(); i++) {
            columns.get(i).setJsName("c" + (i+1));
        }

        // 重新装载数据
        List<Map> newDatas = new ArrayList<Map>();
        for (String row : rows) {
            Map newData = new HashMap();
            newData.put("c", row);
            newDatas.add(newData);
            for (Column column : columns) {
                Object value = getValue(bufferDatas, row, column.getJavaName());
                newData.put(column.getJsName(), value);
            }
        }

        context.setOutMessage(false);
        ReportResponseObject object = new ReportResponseObject();
        object.setSuccess(true);
        object.setDatas(newDatas);
        object.setTotalCounts(newDatas.size());
        object.setColumns(columns);
        WebWriter.jsonWriter(context.response, JsonUtil.beanToJson(object));
    }

    private Object getValue(Map<String, Object> datas, String row, String column) {
        return datas.get(row + column);
    }

}
