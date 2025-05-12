package com.nfwork.erp.interceptor;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.util.DataUtil;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.WebWriter;
import com.nfwork.dbfound.web.base.Interceptor;
import com.nfwork.erp.mq.RabbitMQManager;

public class SimpleCheckInterceptor implements Interceptor {

	Map<String, String> accessMap;

	public boolean jspInterceptor(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Object user_id = request.getSession().getAttribute("user_id");

		if (user_id == null) {
			String url = request.getServletPath();
			if (check(url)) {
				return true;
			} else {
				if (url.startsWith("/mobile/")) {
					request.getRequestDispatcher("/mobile/login.jsp").forward(
							request, response);
				}else{
					request.getRequestDispatcher("/sessionExpire.jsp").forward(
							request, response);
				}
				return false;
			}
		} else {
			return true;
		}
	}
	
	private boolean commonInterceptor(Context context, String modelName, String name, String type) throws Exception {
		Object user_id = context.request.getSession().getAttribute("user_id");

		if (user_id == null) {
			String url = context.request.getServletPath();

			// 添加mq响应处理
			if("mqSender".equals(RabbitMQManager.getModel())){
				if(RabbitMQManager.isLogin(context)){
					RabbitMQManager.mqCall(context, modelName, name, type);
					return false;
				}
			}
			if (check(url)) {
				return true;
			} else {
				Map<String,Object> map = new HashMap<>();
				map.put("timeout", true);
				map.put("message", "session超时或未登录");
				map.put("success", false);
				WebWriter.jsonWriter(context.response, JsonUtil.toJson(map));
				return false;
			}
		} else {
			// 添加mq响应处理
			if("mqSender".equals(RabbitMQManager.getModel())){
				RabbitMQManager.mqCall(context, modelName, name, type);
				return false;
			}
			return true;
		}
	}

	@Override
	public void setCors(HttpServletRequest request, HttpServletResponse response) {
		String origin = request.getHeader("Origin");
		if(DataUtil.isNotNull(origin)) {
			String jsessionid = request.getSession().getId();
			response.setHeader("Jsessionid", jsessionid);
			response.setHeader("Access-Control-Allow-Origin", origin);
			response.setHeader("Access-Control-Max-Age", "1800");
			response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
			response.setHeader("Access-Control-Allow-Headers", "Content-Type");
			response.setHeader("Access-Control-Expose-Headers", "Jsessionid");
			response.setHeader("Access-Control-Allow-Credentials", "true");
		}
	}

	public boolean doInterceptor(Context context, String className,String method) throws Exception{
		return commonInterceptor(context, className, method,"do");
	}

	public boolean executeInterceptor(Context context, String modelName, String executeName) throws Exception {
		return commonInterceptor(context, modelName, executeName,"execute");
	}

	public boolean exportInterceptor(Context context, String modelName, String queryName) throws Exception {
		return commonInterceptor(context, modelName, queryName,"export");
	}

	public boolean queryInterceptor(Context context, String modelName,String queryName) throws Exception {
		return commonInterceptor(context, modelName, queryName,"query");
	}
	
	public boolean check(String url) {
		return accessMap.get(url) != null;
	}

	public void init() {
		accessMap = new HashMap<>();
		accessMap.put("/login.jsp", "1");
		accessMap.put("/relogin.jsp", "1");
		accessMap.put("/close.jsp", "1");
		accessMap.put("/loginWindow.jsp", "1");
		accessMap.put("/sys/login.execute", "1");
		accessMap.put("/sys/wxLogin.execute!login", "1");
		accessMap.put("/mobile/login.jsp", "1");
	}

}
