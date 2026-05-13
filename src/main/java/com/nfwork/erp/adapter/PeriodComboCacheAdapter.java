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
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class PeriodComboCacheAdapter implements MapQueryAdapter, ExecuteAdapter {

    private static final Cache<String, QueryResponseObject<Map<String, Object>>> periodCache = Caffeine.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .initialCapacity(50)
            .maximumSize(500)
            .build();
    private static final Set<String> cacheKeySet = ConcurrentHashMap.newKeySet();

    @Override
    public QueryResponseObject<Map<String, Object>> handleQuery(Context context, Map<String, Param> params) {
        String book_id = context.getString("session.book_id");
        if (DataUtil.isNotNull(book_id)){
            cacheKeySet.add(context.getCurrentModelAction());
            String key = context.getCurrentModelAction() + book_id;
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
        if(DataUtil.isNotNull(book_id)) {
            String key = context.getCurrentModelAction() + book_id;
            periodCache.put(key, responseObject);
        }
    }

    @Override
    public void afterExecute(Context context, Map<String, Param> params) {
        String book_id = context.getString("session.book_id");
        if(DataUtil.isNotNull(book_id)) {
            for (String key : cacheKeySet) {
                periodCache.invalidate(key + book_id);
            }
        }
    }
}
