package com.nfwork.erp.mq;

import com.nfwork.dbfound.util.UUIDUtil;
import com.rabbitmq.client.*;
import org.apache.commons.pool2.impl.GenericObjectPool;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.*;

public class RequestSender {
    private final Connection connection;
    private final GenericObjectPool<Channel> channelPool;
    private final Map<String, BlockingQueue<String>> responseMap = new ConcurrentHashMap<>();
    private final Channel consumerChannel;
    private final String replyQueueName;
    
    public RequestSender() throws IOException, TimeoutException {
        ConnectionFactory factory = RabbitMQConfig.createConnectionFactory();
        connection = factory.newConnection();
        channelPool = new GenericObjectPool<>(new ChannelFactory(connection), RabbitMQConfig.createPoolConfig());
        
        // 创建专门用于消费响应的Channel
        consumerChannel = connection.createChannel();

        // 创建持久化的回复队列
        replyQueueName = RabbitMQConfig.REPLY_QUEUE_NAME + UUIDUtil.getRandomString(8).toLowerCase();
        consumerChannel.queueDeclare(replyQueueName, false, false, true, null);
        
        // 设置全局消费者
        consumerChannel.basicConsume(replyQueueName, true, (consumerTag, delivery) -> {
            String correlationId = delivery.getProperties().getCorrelationId();
            String response = new String(delivery.getBody(), StandardCharsets.UTF_8);
            BlockingQueue<String> responseQueue = responseMap.get(correlationId);
            if (responseQueue != null) {
                responseQueue.offer(response);
            }
        }, consumerTag -> {});
    }
    
    public String sendAndReceive(String message) throws IOException {
        Channel channel = null;
        final String corrId = UUID.randomUUID().toString();
        final BlockingQueue<String> response = new ArrayBlockingQueue<>(1);
        responseMap.put(corrId, response);
        
        try {
            channel = channelPool.borrowObject();
            AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
                    .correlationId(corrId)
                    .replyTo(replyQueueName)
                    .build();

            channel.basicPublish("", RabbitMQConfig.REQUEST_QUEUE_NAME, props, message.getBytes(StandardCharsets.UTF_8));
            channelPool.returnObject(channel);
            channel = null;

            String result = response.poll(RabbitMQConfig.REQUEST_TIME_OUT, TimeUnit.SECONDS);
            if (result == null) {
                throw new Exception("Request timeout after 30 seconds");
            }
            return result;
        } catch (Exception e) {
            if (channel != null) {
                try {
                    channelPool.invalidateObject(channel);
                } catch (Exception ignored) {
                }
                channel = null;
            }
            throw new IOException("Failed to process message, clause by " + e.getMessage(), e);
        } finally {
            responseMap.remove(corrId);

            if (channel != null) {
                channelPool.returnObject(channel);
            }
        }
    }

    public void close() throws IOException, TimeoutException {
        if (consumerChannel != null && consumerChannel.isOpen()) {
            consumerChannel.close();
        }
        if (channelPool != null) {
            channelPool.close();
        }
        if (connection != null && connection.isOpen()) {
            connection.close();
        }
    }
}