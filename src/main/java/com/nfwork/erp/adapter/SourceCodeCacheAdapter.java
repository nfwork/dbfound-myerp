package com.nfwork.erp.adapter;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.adapter.MapQueryAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.dbfound.util.DataUtil;
import com.nfwork.dbfound.util.LogUtil;

import java.util.Map;
import java.util.concurrent.TimeUnit;

public class SourceCodeCacheAdapter implements MapQueryAdapter {

    private final Cache<String, QueryResponseObject<Map<String, Object>>> userInfoCache = Caffeine.newBuilder()
            .expireAfterWrite(3, TimeUnit.MINUTES)
            .initialCapacity(50)
            .maximumSize(500)
            .build();
    @Override
    public QueryResponseObject<Map<String, Object>> handleQuery(Context context, Map<String, Param> params) {
        String code = context.getString("param.code");
        if (DataUtil.isNotNull(code)){
            QueryResponseObject<Map<String, Object>> info = userInfoCache.getIfPresent(code);
            if(info!=null){
                LogUtil.info("get sourceCode from cache, code: " + code);
            }
            return info;
        }
        return null;
    }

    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<Map<String, Object>> responseObject) {
        String code = context.getString("param.code");
        if(DataUtil.isNotNull(code)) {
            userInfoCache.put(code, responseObject);
        }
    }
}
