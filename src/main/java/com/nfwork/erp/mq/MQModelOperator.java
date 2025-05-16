package com.nfwork.erp.mq;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.dto.ResponseObject;
import com.nfwork.dbfound.model.ModelOperator;
import com.nfwork.dbfound.util.JsonUtil;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.nfwork.erp.dto.ReportResponseObject;

public class MQModelOperator extends ModelOperator {

    @Override
    public <T> QueryResponseObject<T> query(Context context, String modelName, String queryName, String sourcePath, boolean autoPaging, Class<T> clazz) {
        try {
            String result = RabbitMQManager.mqCall(context,modelName,queryName,sourcePath,autoPaging,"query");
            ObjectMapper objectMapper = JsonUtil.getObjectMapper();
            
            if (clazz != null) {
                // 使用JavaType来构建正确的泛型类型
                JavaType itemType = TypeFactory.defaultInstance().constructType(clazz);
                JavaType responseType = TypeFactory.defaultInstance().constructParametricType(QueryResponseObject.class, itemType);
                return objectMapper.readValue(result, responseType);
            } else {
                System.out.println(result);
                // 默认转换为QueryResponseObject
                return objectMapper.readValue(result, ReportResponseObject.class);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseObject batchExecute(Context context, String modelName, String executeName, String sourcePath) {
        try {
            String result = RabbitMQManager.mqCall(context,modelName, executeName,sourcePath,false,"batchExecute");
            ObjectMapper objectMapper = JsonUtil.getObjectMapper();
            return objectMapper.readValue(result, QueryResponseObject.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseObject execute(Context context, String modelName, String executeName, String sourcePath) {
        try {
            String result = RabbitMQManager.mqCall(context,modelName, executeName,sourcePath,false,"execute");
            ObjectMapper objectMapper = JsonUtil.getObjectMapper();
            return objectMapper.readValue(result, QueryResponseObject.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
