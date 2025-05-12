package com.nfwork.erp.mq;

public class RabbitMQConfig {
    private static final String HOST = "192.168.65.7";
    private static final String USERNAME = "dbfound";
    private static final String PASSWORD = "dbfound";
    private static final int PORT = 5672;  // RabbitMQ默认端口
    
    public static final String REQUEST_QUEUE_NAME = "request_queue";

    public static com.rabbitmq.client.ConnectionFactory createConnectionFactory() {
        com.rabbitmq.client.ConnectionFactory factory = new com.rabbitmq.client.ConnectionFactory();
        factory.setHost(HOST);
        factory.setPort(PORT);
        factory.setUsername(USERNAME);
        factory.setPassword(PASSWORD);
        return factory;
    }
}