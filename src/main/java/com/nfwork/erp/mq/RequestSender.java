package com.nfwork.erp.mq;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeoutException;

public class RequestSender {
    private final Connection connection;
    
    public RequestSender() throws IOException, TimeoutException {
        ConnectionFactory factory = RabbitMQConfig.createConnectionFactory();
        connection = factory.newConnection();
    }
    
    public String sendAndReceive(String message) throws IOException, InterruptedException, TimeoutException {
        // 每个请求创建独立的通道
        try (Channel channel = connection.createChannel()) {
            final String corrId = UUID.randomUUID().toString();
            String replyQueueName = channel.queueDeclare().getQueue();
            AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
                    .correlationId(corrId)
                    .replyTo(replyQueueName)
                    .build();

            channel.basicPublish("", RabbitMQConfig.REQUEST_QUEUE_NAME, props, message.getBytes(StandardCharsets.UTF_8));

            final BlockingQueue<String> response = new ArrayBlockingQueue<>(1);

            String ctag = channel.basicConsume(replyQueueName, true, (consumerTag, delivery) -> {
                if (delivery.getProperties().getCorrelationId().equals(corrId)) {
                    response.offer(new String(delivery.getBody(), StandardCharsets.UTF_8));
                }
            }, consumerTag -> {});

            String result = response.take();
            channel.basicCancel(ctag);
            return result;
        }
    }

    public void close() throws IOException, TimeoutException {
        if (connection != null && connection.isOpen()) {
            connection.close();
        }
    }
}