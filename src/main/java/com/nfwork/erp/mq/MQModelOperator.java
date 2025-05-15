package com.nfwork.erp.mq;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.ModelOperator;
import com.nfwork.dbfound.util.JsonUtil;

public class MQModelOperator extends ModelOperator {

    @Override
    public <T> QueryResponseObject<T> query(Context context, String modelName, String queryName, String sourcePath, boolean autoPaging, Class<T> clazz) {
        try {
            String result = RabbitMQManager.mqCall(context,modelName,queryName,"query");
            return JsonUtil.getObjectMapper().readValue(result, QueryResponseObject.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
