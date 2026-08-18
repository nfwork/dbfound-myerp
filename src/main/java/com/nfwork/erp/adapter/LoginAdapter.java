package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.model.adapter.ExecuteAdapter;
import com.nfwork.dbfound.model.bean.Param;

import java.util.Map;

public class LoginAdapter implements ExecuteAdapter {

    @Override
    public void beforeExecute(Context context, Map<String, Param> params) {
        fillJsessionid(context, params);
    }

    static void fillJsessionid(Context context, Map<String, Param> params) {
        Param param = params.get("jsessionid");
        if (param != null && context.request != null) {
            param.setValue(context.request.getSession().getId());
        }
    }
}
