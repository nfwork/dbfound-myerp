package com.nfwork.erp.mq;


import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.util.TransactionUtil;

import java.util.Map;
import java.util.Objects;

public class RabbitMQManager {

    static volatile RequestCustomer customer = null;

    static volatile RequestSender sender = null;

    static String serviceMode = null;

    public static void initCustomer() {
        if (customer == null) {
            synchronized (RabbitMQManager.class) {
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

    public static void initSender() {
        if (sender == null) {
            synchronized (RabbitMQManager.class){
                if (sender == null) {
                    try {
                        sender = new RequestSender();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    public static String mqCall(Context context, String modelName, String name, String sourcePath, boolean autoPaging,String type) throws Exception {
        Map<String, Object> data = context.getDatas();
        data.put("_modelName", modelName);
        data.put("_name", name);
        data.put("_sourcePath", sourcePath);
        data.put("_type", type);
        data.put("_autoPaging", autoPaging);
        data.put("_export", context.isExport());
        String result = sender.sendAndReceive(JsonUtil.toJson(data));
        if (type.equals("execute") && isLogin(context)) {
            Map<String, Object> map = JsonUtil.jsonToMap(result);
            if(Objects.equals(map.get("success"), true)) {
                map = (Map<String, Object>) map.get("outParam");
                context.request.getSession().setAttribute("user_id", map.get("user_id"));
                context.request.getSession().setAttribute("openid", map.get("openid"));
                context.request.getSession().setAttribute("book_id", map.get("book_id"));
                context.request.getSession().setAttribute("user_code", map.get("user_code"));
                context.request.getSession().setAttribute("user_name", map.get("user_name"));
                context.request.getSession().setAttribute("role_id", map.get("role_id"));
                context.request.getSession().setAttribute("role_code", map.get("role_code"));
                context.request.getSession().setAttribute("role_description", map.get("role_description"));
            }
        }
        return result;
    }

    public static Object mqProcess(String message) throws Exception {
        Map<String,Object> data = JsonUtil.jsonToMap(message);
        String type = data.get("_type").toString();
        String name = (String) data.get("_name");
        String modelName = data.get("_modelName").toString();
        String sourcePath = (String) data.get("_sourcePath");
        boolean autoPaging = (boolean) data.get("_autoPaging");
        boolean export = (boolean) data.get("_export");
        Context context = new Context(data);
        context.setExport(export);

        Object result;
        if(type.equals("execute")){
            result = TransactionUtil.execute(context,()-> ModelEngine.execute(context,modelName,name,sourcePath));
        }else if(type.equals("batchExecute")){
            result = TransactionUtil.execute(context,()-> ModelEngine.batchExecute(context,modelName,name,sourcePath));
        }else{
            result = ModelEngine.query(context,modelName,name,sourcePath,autoPaging);
        }
        return result;
    }

    public static boolean isLogin(Context context) {
        String url = context.request.getServletPath();
        return url.equals("/sys/login.execute") || url.equals("/sys/wxLogin.execute!login");
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

    public static String getServiceMode() {
        return serviceMode;
    }

    public static void setServiceMode(String serviceMode) {
        RabbitMQManager.serviceMode = serviceMode;
    }
}
