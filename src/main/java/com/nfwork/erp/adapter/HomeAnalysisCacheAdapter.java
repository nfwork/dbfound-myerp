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
import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class HomeAnalysisCacheAdapter implements MapQueryAdapter, ExecuteAdapter {

    private static final Cache<String, QueryResponseObject<Map<String, Object>>> homeAnalysisCache = Caffeine.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .initialCapacity(50)
            .maximumSize(500)
            .build();
    @Override
    public QueryResponseObject<Map<String, Object>> handleQuery(Context context, Map<String, Param> params) {
        String book_id = context.getString("session.book_id");
        if (DataUtil.isNotNull(book_id)){
            QueryResponseObject<Map<String, Object>> info = homeAnalysisCache.getIfPresent(getKey(book_id));
            if(info!=null){
                LogUtil.info("get homeAnalysis from cache, book_id: " + book_id);
            }
            return info;
        }
        return null;
    }

    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<Map<String, Object>> responseObject) {
        String book_id = context.getString("session.book_id");
        if(DataUtil.isNotNull(book_id)) {
            homeAnalysisCache.put(getKey(book_id), responseObject);
        }
    }

    @Override
    public void afterExecute(Context context, Map<String, Param> params) {
        String book_id = context.getString("session.book_id");
        if(DataUtil.isNotNull(book_id)) {
            homeAnalysisCache.invalidate(getKey(book_id));
        }
    }

    /**
     * 缓存 按天算
     */
    private String getKey(String book_id){
        return LocalDate.now() + "_" + book_id;
    }

}
