package com.nfwork.erp.mq;


import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.WebWriter;

import java.util.Map;

public class RabbitMQUtil {

    static RequestCustomer customer = null;

    static RequestSender sender = null;

    static String model = null;

    public static void initCustomer() {
        if (customer == null &&  "mqCustomer".equals(model)) {
            synchronized (RabbitMQUtil.class) {
                if (customer == null) {
                    try {
                        customer = new RequestCustomer();
                        customer.startConsuming();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    public static void mqCall(Context context, String modelName, String name, String type) throws Exception {
        if("query".equals(type) || "execute".equals(type)) {
            Map<String, Object> data = context.getDatas();
            data.put("_modelName", modelName);
            data.put("_name", name);
            data.put("_type", type);
            String result = RabbitMQUtil.getRequestSender().sendAndReceive(JsonUtil.toJson(data));
            if (isLogin(context)) {
                Map<String, Object> map = JsonUtil.jsonToMap(result);
                map = (Map<String, Object>) map.get("outParam");
                context.request.getSession().setAttribute("user_id", map.get("user_id"));
                context.request.getSession().setAttribute("book_id", map.get("book_id"));
                context.request.getSession().setAttribute("user_code", map.get("user_code"));
                context.request.getSession().setAttribute("user_name", map.get("user_name"));
                context.request.getSession().setAttribute("role_id", map.get("role_id"));
            }
            WebWriter.jsonWriter(context.response, result);
        }
    }

    public static boolean isLogin(Context context) {
        String url = context.request.getServletPath();
        return url.equals("/sys/login.execute") || url.equals("/sys/wxLogin.execute");
    }

    public static RequestSender getRequestSender(){
        try {
            if (sender == null) {
                synchronized (RabbitMQUtil.class){
                    if (sender == null) {
                        sender = new RequestSender();
                    }
                }
            }
            return sender;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static void destroy() {
        try {
            if(customer != null) {
                customer.close();
            }
            if(sender != null) {
                sender.close();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static String getModel() {
        return model;
    }

    public static void setModel(String model) {
        RabbitMQUtil.model = model;
    }
}
