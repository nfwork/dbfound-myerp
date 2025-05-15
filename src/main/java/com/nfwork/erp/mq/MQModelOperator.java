package com.nfwork.erp.mq;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.ModelOperator;
import com.nfwork.dbfound.util.JsonUtil;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;

public class MQModelOperator extends ModelOperator {

    @Override
    public <T> QueryResponseObject<T> query(Context context, String modelName, String queryName, String sourcePath, boolean autoPaging, Class<T> clazz) {
        try {
            String result = RabbitMQManager.mqCall(context,modelName,queryName,"query");
            ObjectMapper objectMapper = JsonUtil.getObjectMapper();
            
            if (clazz != null) {
                // 使用JavaType来构建正确的泛型类型
                JavaType itemType = TypeFactory.defaultInstance().constructType(clazz);
                JavaType responseType = TypeFactory.defaultInstance().constructParametricType(QueryResponseObject.class, itemType);
                return objectMapper.readValue(result, responseType);
            } else {
                // 默认转换为QueryResponseObject
                return objectMapper.readValue(result, QueryResponseObject.class);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
