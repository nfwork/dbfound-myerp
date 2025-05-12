package com.nfwork.erp.mq;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.ResponseObject;
import com.nfwork.dbfound.exception.CollisionException;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.util.LogUtil;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.Map;
import java.util.concurrent.TimeoutException;

public class RequestCustomer {
    private final Connection connection;
    private final Channel channel;

    public RequestCustomer() throws IOException, TimeoutException {
        ConnectionFactory factory = RabbitMQConfig.createConnectionFactory();
        connection = factory.newConnection();
        channel = connection.createChannel();
        
        // 声明请求队列
        channel.queueDeclare(RabbitMQConfig.REQUEST_QUEUE_NAME, false, false, false, null);
    }

    public void startConsuming() throws Exception {
        // 创建消费者
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            String replyTo = delivery.getProperties().getReplyTo();
            String correlationId = delivery.getProperties().getCorrelationId();

            // 处理消息并生成响应
            String response;
            try {
                response = processMessage(message);
            } catch (Exception e) {
                response = JsonUtil.toJson(handle(e));
            }

            // 发送响应
            AMQP.BasicProperties replyProps = new AMQP.BasicProperties.Builder()
                    .correlationId(correlationId)
                    .build();

            channel.basicPublish("", replyTo, replyProps, response.getBytes(StandardCharsets.UTF_8));
        };

        // 开始消费消息
        channel.basicConsume(RabbitMQConfig.REQUEST_QUEUE_NAME, true, deliverCallback, consumerTag -> {});
    }

    private String processMessage(String message) throws Exception {
        // 这里实现你的业务逻辑
        Map<String,Object> data = JsonUtil.jsonToMap(message);
        String type = data.get("_type").toString();
        String name = (String) data.get("_name");
        String modelName = data.get("_modelName").toString();
        Context context = new Context(data);

        Object result;
        if(type.equals("execute")){
            result = ModelEngine.execute(context,modelName,name);
        }else{
            result = ModelEngine.query(context,modelName,name);
        }
        return JsonUtil.toJson(result);
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
        channel.close();
        connection.close();
    }
}
