package com.nfwork.erp.mq;

import com.nfwork.dbfound.dto.ResponseObject;
import com.nfwork.dbfound.exception.CollisionException;
import com.nfwork.dbfound.exception.NoServletResponseException;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.util.LogUtil;
import com.rabbitmq.client.*;
import org.apache.commons.pool2.impl.GenericObjectPool;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RequestCustomer {
    private final Connection connection;
    private final GenericObjectPool<Channel> channelPool;
    private final ExecutorService executorService;
    private final Channel consumerChannel; // 新增独立的消费者Channel

    public RequestCustomer() throws IOException, TimeoutException {
        ConnectionFactory factory = RabbitMQConfig.createConnectionFactory();
        connection = factory.newConnection();
        channelPool = new GenericObjectPool<>(new ChannelFactory(connection), RabbitMQConfig.createPoolConfig());
        
        // 创建固定大小的线程池，大小可以根据实际需求调整
        executorService = Executors.newFixedThreadPool(20);
        
        // 创建独立的消费者Channel
        consumerChannel = connection.createChannel();
        // 声明请求队列
        consumerChannel.queueDeclare(RabbitMQConfig.REQUEST_QUEUE_NAME, false, false, false, null);
    }

    public void startConsuming() throws Exception {
        // 创建消费者
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            // 使用线程池处理消息
            executorService.submit(() -> {

                String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
                // 处理消息并生成响应
                String response;
                try {
                    response = processMessage(message);
                } catch (NoServletResponseException me) {
                    response = me.getContent();
                } catch (Exception e) {
                    LogUtil.error("处理失败了，message：" + message, e);
                    response = JsonUtil.toJson(handle(e));
                }

                Channel channel = null;
                try {
                    channel = channelPool.borrowObject();
                    String replyTo = delivery.getProperties().getReplyTo();
                    String correlationId = delivery.getProperties().getCorrelationId();

                    // 发送响应
                    AMQP.BasicProperties replyProps = new AMQP.BasicProperties.Builder()
                            .correlationId(correlationId)
                            .build();

                    channel.basicPublish("", replyTo, replyProps, response.getBytes(StandardCharsets.UTF_8));
                } catch (Exception e) {
                    LogUtil.error("消息处理过程中发生异常", e);
                    if (channel != null) {
                        try {
                            channelPool.invalidateObject(channel);
                        } catch (Exception ignored) {
                        }
                        channel = null;
                    }
                } finally {
                    if (channel != null) {
                        try {
                            channelPool.returnObject(channel);
                        } catch (Exception ignored) {
                        }
                    }
                }
            });
        };

        // 使用独立的consumerChannel进行消费
        consumerChannel.basicConsume(RabbitMQConfig.REQUEST_QUEUE_NAME, true, deliverCallback, consumerTag -> {});
    }

    // 移除了内部的 ChannelFactory 类
    private String processMessage(String message) throws Exception {
        // 这里实现你的业务逻辑
        return JsonUtil.toJson(RabbitMQManager.mqProcess(message));
    }

    private ResponseObject handle(Exception exception) {
        String em = exception.getMessage();
        String code = null;
        if(exception instanceof CollisionException){
            code = ((CollisionException) exception).getCode();
            LogUtil.info(exception.getClass().getName() + ": " + em);
        } else {
            if(exception.getCause() instanceof SQLException){
                em = exception.getCause().getMessage();
            }
            em =  exception.getClass().getName() +": " + em;
        }
        ResponseObject ro = new ResponseObject();
        ro.setSuccess(false);
        ro.setCode(code);
        ro.setMessage(em);
        return ro;
    }

    public void close() throws IOException, TimeoutException {
        executorService.shutdown(); // 关闭线程池
        if (channelPool != null) {
            channelPool.close();
        }
        if (consumerChannel != null && consumerChannel.isOpen()) {
            consumerChannel.close();
        }
        if (connection != null && connection.isOpen()) {
            connection.close();
        }
    }
}
