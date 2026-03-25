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
        double lastRecordPf = 0D;
        double lastRecordZs = 0D;
        double lastRecordJt = 0D;
        double lastRecordAl = 0D;
        double lastRecordJj = 0D;
        for (Map<String,Object> data : datas) {
            Double recordTotal = (Double) data.remove("record_total");
            Double recordPf = (Double) data.remove("record_pf");
            Double recordZs = (Double) data.remove("record_zs");
            Double recordJt = (Double) data.remove("record_jt");
            Double recordAl = (Double) data.remove("record_al");
            Double recordJj = (Double) data.remove("record_jj");

            Double archiveTotal = nullToZero((Double) data.remove("archive_total"));
            Double archivePf = nullToZero((Double) data.remove("archive_pf"));
            Double archiveZs = nullToZero((Double) data.remove("archive_zs"));
            Double archiveJt = nullToZero((Double) data.remove("archive_jt"));
            Double archiveAl = nullToZero((Double) data.remove("archive_al"));
            Double archiveJj = nullToZero((Double) data.remove("archive_jj"));

            data.put("total", recordTotal - lastRecordTotal + archiveTotal);
            data.put("channel_pf", recordPf - lastRecordPf + archivePf);
            data.put("channel_zs", recordZs - lastRecordZs + archiveZs);
            data.put("channel_jt", recordJt - lastRecordJt + archiveJt);
            data.put("channel_al", recordAl - lastRecordAl + archiveAl);
            data.put("channel_jj", recordJj - lastRecordJj + archiveJj);

            lastRecordTotal = recordTotal;
            lastRecordPf = recordPf;
            lastRecordZs = recordZs;
            lastRecordJt = recordJt;
            lastRecordAl = recordAl;
            lastRecordJj = recordJj;
        }
    }

    private double nullToZero(Double value) {
        return value == null ? 0D : value;
    }
}
