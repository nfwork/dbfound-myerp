package com.nfwork.erp.adapter;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.adapter.ExecuteAdapter;
import com.nfwork.dbfound.model.adapter.MapQueryAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.dbfound.util.DataUtil;
import com.nfwork.dbfound.util.LogUtil;

import java.util.Map;
import java.util.concurrent.TimeUnit;

public class PeriodComboCacheAdapter implements MapQueryAdapter, ExecuteAdapter {

    private static final Cache<String, QueryResponseObject<Map<String, Object>>> periodCache = Caffeine.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .initialCapacity(50)
            .maximumSize(500)
            .build();
    @Override
    public QueryResponseObject<Map<String, Object>> handleQuery(Context context, Map<String, Param> params) {
        String book_id = context.getString("session.book_id");
        if (DataUtil.isNotNull(book_id) && params.containsKey("cache_key")){
            String key = params.get("cache_key").getStringValue() + book_id;
            QueryResponseObject<Map<String, Object>> info = periodCache.getIfPresent(key);
            if(info!=null){
                LogUtil.info("get period from cache, cache_key: " + key);
            }
            return info;
        }
        return null;
    }

    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<Map<String, Object>> responseObject) {
        String book_id = context.getString("session.book_id");
        if(DataUtil.isNotNull(book_id) && params.containsKey("cache_key")) {
            String key = params.get("cache_key").getStringValue() + book_id;
            periodCache.put(key, responseObject);
        }
    }

    @Override
    public void afterExecute(Context context, Map<String, Param> params) {
        String book_id = context.getString("session.book_id");
        if(DataUtil.isNotNull(book_id)) {
            periodCache.invalidate("combo_"+book_id);
            periodCache.invalidate("combo_all_"+book_id);
        }
    }
}
