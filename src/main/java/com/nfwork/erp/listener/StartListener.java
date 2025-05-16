package com.nfwork.erp.listener;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.nfwork.dbfound.core.DBFoundConfig;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.base.Listener;
import com.nfwork.erp.mq.MQModelOperator;
import com.nfwork.erp.mq.RabbitMQManager;

import javax.servlet.ServletContext;

public class StartListener implements Listener {
    @Override
    public void init(ServletContext servletContext) {
        DBFoundConfig.getSensitiveParamSet().add("ypassword");

        JsonUtil.getObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.LOWER_CAMEL_CASE);;

        RabbitMQManager.setServiceMode(servletContext.getInitParameter("serviceMode"));
        // 初始化MQ消费者
        if("mqCustomer".equals(RabbitMQManager.getServiceMode())){
            RabbitMQManager.initCustomer();
        }
        // 初始化MQ消费者
        else if("mqSender".equals(RabbitMQManager.getServiceMode())){
            RabbitMQManager.initSender();
            ModelEngine.setModelOperator(new MQModelOperator());
        }
    }

    @Override
    public void destroy() {
        // 关闭MQ连接
        RabbitMQManager.destroy();
    }
}
