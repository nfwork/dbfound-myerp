package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.exception.CollisionException;
import com.nfwork.dbfound.model.bean.Param;

import java.util.Map;

public class WxLoginAdapter extends WxBindAdapter {

    @Override
    public void beforeExecute(Context context, Map<String, Param> params) {
        if(context.getData("session.user_id")!=null){
            throw new CollisionException("无需登录");
        }
        super.beforeExecute(context,params);
    }
}
