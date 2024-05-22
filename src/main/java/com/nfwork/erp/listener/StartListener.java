package com.nfwork.erp.listener;

import com.nfwork.dbfound.core.DBFoundConfig;
import com.nfwork.dbfound.web.base.Listener;

public class StartListener implements Listener {
    @Override
    public void init() {
        DBFoundConfig.getSensitiveParamSet().add("ypassword");
    }
}
