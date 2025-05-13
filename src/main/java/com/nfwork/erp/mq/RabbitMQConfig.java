package com.nfwork.erp.mq;

import com.rabbitmq.client.ConnectionFactory;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import com.rabbitmq.client.Channel;

public class RabbitMQConfig {
    private static final String HOST = "192.168.65.7";
    private static final String USERNAME = "dbfound";
    private static final String PASSWORD = "dbfound";
    private static final int PORT = 5672;  // RabbitMQ默认端口
    
    public static final String REQUEST_QUEUE_NAME = "request_queue";
    
    // sender channel连接池配置
    private static final int MAX_TOTAL = 20;  // 最大池大小
    private static final int MAX_IDLE = 10;   // 最大空闲
    private static final int MIN_IDLE = 5;    // 最小空闲
    
    public static ConnectionFactory createConnectionFactory() {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(HOST);
        factory.setPort(PORT);
        factory.setUsername(USERNAME);
        factory.setPassword(PASSWORD);
        return factory;
    }
    
    public static GenericObjectPoolConfig<Channel> createPoolConfig() {
        GenericObjectPoolConfig<Channel> poolConfig = new GenericObjectPoolConfig<>();
        poolConfig.setMaxTotal(MAX_TOTAL);
        poolConfig.setMaxIdle(MAX_IDLE);
        poolConfig.setMinIdle(MIN_IDLE);
        poolConfig.setTestOnBorrow(true);
        return poolConfig;
    }
}