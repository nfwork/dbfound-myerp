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
import java.util.HashMap;
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
                // 缓存按 book_id 共享，需用当前 session 覆盖用户态字段，避免串号
                return copyWithCurrentUser(info, context);
            }
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

    /**
     * 返回带当前用户信息的浅拷贝，避免并发请求互相覆盖 outParam.user_name
     */
    private QueryResponseObject<Map<String, Object>> copyWithCurrentUser(
            QueryResponseObject<Map<String, Object>> cached, Context context) {
        QueryResponseObject<Map<String, Object>> result = new QueryResponseObject<>();
        result.setSuccess(cached.isSuccess());
        result.setMessage(cached.getMessage());
        result.setCode(cached.getCode());
        result.setDatas(cached.getDatas());
        result.setTotalCounts(cached.getTotalCounts());
        Map<String, Object> outParam = new HashMap<>();
        if (cached.getOutParam() != null) {
            outParam.putAll(cached.getOutParam());
        }
        outParam.put("user_name", context.getString("session.user_name"));
        result.setOutParam(outParam);
        return result;
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
