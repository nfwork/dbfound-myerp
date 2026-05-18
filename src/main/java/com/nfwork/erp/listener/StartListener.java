package com.nfwork.erp.listener;

import com.nfwork.dbfound.core.DBFoundConfig;
import com.nfwork.dbfound.web.base.Listener;
import com.nfwork.erp.mq.RabbitMQManager;

import javax.servlet.ServletContext;

public class StartListener implements Listener {
    @Override
    public void init(ServletContext servletContext) {
        DBFoundConfig.getSensitiveParamSet().add("ypassword");

        String serviceMode = System.getProperty("myErp.serviceMode");
        // 初始化MQ消费者
        if("mqCustomer".equals(serviceMode)){
            RabbitMQManager.initCustomer();
        }
        // 初始化MQ消费者
        else if("mqSender".equals(serviceMode)){
            RabbitMQManager.initSender();
        }
    }

    @Override
    public void destroy() {
        // 关闭MQ连接
        RabbitMQManager.destroy();
    }
}
