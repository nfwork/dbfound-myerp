package com.nfwork.erp.mq;

import com.rabbitmq.client.*;
import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.apache.commons.pool2.impl.GenericObjectPool;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeoutException;

public class RequestSender {
    private final Connection connection;
    private final GenericObjectPool<Channel> channelPool;
    
    public RequestSender() throws IOException, TimeoutException {
        ConnectionFactory factory = RabbitMQConfig.createConnectionFactory();
        connection = factory.newConnection();
        channelPool = new GenericObjectPool<>(new ChannelFactory(connection), RabbitMQConfig.createPoolConfig());
    }
    
    public String sendAndReceive(String message) throws IOException {
        Channel channel = null;
        try {
            channel = channelPool.borrowObject();
            final String corrId = UUID.randomUUID().toString();
            String replyQueueName = channel.queueDeclare().getQueue();
            AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
                    .correlationId(corrId)
                    .replyTo(replyQueueName)
                    .build();

            final BlockingQueue<String> response = new ArrayBlockingQueue<>(1);

            String ctag = channel.basicConsume(replyQueueName, true, (consumerTag, delivery) -> {
                if (delivery.getProperties().getCorrelationId().equals(corrId)) {
                    response.offer(new String(delivery.getBody(), StandardCharsets.UTF_8));
                }
            }, consumerTag -> {});

            try {
                channel.basicPublish("", RabbitMQConfig.REQUEST_QUEUE_NAME, props, message.getBytes(StandardCharsets.UTF_8));
                return response.take();
            } finally {
                channel.basicCancel(ctag);
            }
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
            if (channel != null) {
                channelPool.returnObject(channel);
            }
        }
    }

    private static class ChannelFactory extends BasePooledObjectFactory<Channel> {
        private final Connection connection;

        public ChannelFactory(Connection connection) {
            this.connection = connection;
        }

        @Override
        public Channel create() throws Exception {
            return connection.createChannel();
        }

        @Override
        public PooledObject<Channel> wrap(Channel channel) {
            return new DefaultPooledObject<>(channel);
        }

        @Override
        public boolean validateObject(PooledObject<Channel> pooledObject) {
            Channel channel = pooledObject.getObject();
            return channel.isOpen();
        }

        @Override
        public void destroyObject(PooledObject<Channel> pooledObject) throws Exception {
            Channel channel = pooledObject.getObject();
            if (channel.isOpen()) {
                channel.close();
            }
        }
    }

    public void close() throws IOException, TimeoutException {
        if (channelPool != null) {
            channelPool.close();
        }
        if (connection != null && connection.isOpen()) {
            connection.close();
        }
    }
}