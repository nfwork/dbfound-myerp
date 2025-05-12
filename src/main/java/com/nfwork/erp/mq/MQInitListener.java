package com.nfwork.erp.mq;

import javax.servlet.ServletContextListener;
import javax.servlet.ServletContextEvent;
import javax.servlet.annotation.WebListener;

@WebListener
public class MQInitListener implements ServletContextListener {
    
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        RabbitMQUtil.setModel(sce.getServletContext().getInitParameter("model"));
        // 初始化MQ消费者
        RabbitMQUtil.initCustomer();
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // 关闭MQ连接
        RabbitMQUtil.destroy();
    }
}