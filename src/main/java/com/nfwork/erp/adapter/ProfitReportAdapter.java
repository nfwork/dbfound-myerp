package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.adapter.MapQueryAdapter;
import com.nfwork.dbfound.model.bean.Param;

import java.util.List;
import java.util.Map;

public class ProfitReportAdapter implements MapQueryAdapter {
    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<Map<String, Object>> responseObject) {
        List<Map<String,Object>> datas = responseObject.getDatas();
        double lastRecordTotal = 0D;
        for (Map<String,Object> data : datas) {
            Double recordTotal = (Double)data.get("record_total") ;
            Double archiveTotal = (Double) data.get("archive_total");
            if (archiveTotal==null) {
                archiveTotal = 0D;
            }
            data.put("total", recordTotal- lastRecordTotal + archiveTotal);
            lastRecordTotal = recordTotal;
        }
    }
}
