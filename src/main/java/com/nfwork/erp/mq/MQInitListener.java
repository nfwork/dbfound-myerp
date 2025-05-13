package com.nfwork.erp.mq;

import javax.servlet.ServletContextListener;
import javax.servlet.ServletContextEvent;
import javax.servlet.annotation.WebListener;

@WebListener
public class MQInitListener implements ServletContextListener {
    
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        RabbitMQManager.setModel(sce.getServletContext().getInitParameter("model"));
        // 初始化MQ消费者
        if("mqCustomer".equals(RabbitMQManager.getModel())){
            RabbitMQManager.initCustomer();
        }
        // 初始化MQ消费者
        else if("mqSender".equals(RabbitMQManager.getModel())){
            RabbitMQManager.initSender();
        }
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // 关闭MQ连接
        RabbitMQManager.destroy();
    }
}