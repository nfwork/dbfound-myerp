package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.adapter.QueryAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.erp.dto.ProfitReportItem;

import java.util.List;
import java.util.Map;

public class ProfitReportAdapter implements QueryAdapter<ProfitReportItem> {
    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<ProfitReportItem> responseObject) {
        List<ProfitReportItem> datas = responseObject.getDatas();
        ProfitReportItem lastRecord = ProfitReportItem.emptyRecord();
        for (ProfitReportItem data : datas) {
            data.calculateWithPrevious(lastRecord);
            lastRecord = data;
        }
    }
}
