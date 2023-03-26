package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.model.adapter.QueryAdapter;
import com.nfwork.dbfound.model.bean.Param;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

public class PeriodAdapter implements QueryAdapter<Object> {

    @Override
    public void beforeQuery(Context context, Map<String, Param> params) {
       int size = ModelEngine.query(context,"report/homeAnalysis","getCurrentPeriod").getDatas().size();
       if( size == 0){
           Date date = new Date();
           SimpleDateFormat format = new SimpleDateFormat("yyyy-MM");
           SimpleDateFormat formatS = new SimpleDateFormat("yyyy年MM月");
           context.setParamData("period_code",format.format(date));
           context.setParamData("period_name",formatS.format(date));
           ModelEngine.execute(context,"report/homeAnalysis","autoCreate");
       }
    }
}
