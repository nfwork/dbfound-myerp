package com.nfwork.erp.interceptor;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.core.DBFoundConfig;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.WebWriter;
import com.nfwork.dbfound.web.base.Interceptor;

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
	
	private boolean commonInterceptor(Context context){
		Object user_id = context.request.getSession().getAttribute("user_id");

		if (user_id == null) {
			String url = context.request.getServletPath();
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
			return true;
		}
	}

	@Override
	public void setCorsMapping(HttpServletRequest request, HttpServletResponse response) {
		// 允许所有源访问
		response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
		// 允许的HTTP方法
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
		// 允许的头信息字段
		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Cookie, Set-Cookie");
		response.setHeader("Access-Control-Expose-Headers", "*");
		// 是否允许携带认证信息
		response.setHeader("Access-Control-Allow-Credentials", "true");
	}

	public boolean doInterceptor(Context context, String className,
								 String method) throws Exception {
		return commonInterceptor(context);
	}

	public boolean executeInterceptor(Context context, String modelName, String executeName) {
		return commonInterceptor(context);
	}

	public boolean exportInterceptor(Context context, String modelName, String queryName){
		return commonInterceptor(context);
	}

	public boolean queryInterceptor(Context context, String modelName,String queryName){
		return commonInterceptor(context);
	}
	
	public boolean check(String url) {
		return accessMap.get(url) != null;
	}

	public void init() {
		initConfig();

		accessMap = new HashMap<>();
		accessMap.put("/login.jsp", "1");
		accessMap.put("/relogin.jsp", "1");
		accessMap.put("/close.jsp", "1");
		accessMap.put("/loginWindow.jsp", "1");
		accessMap.put("/sys/login.execute", "1");
		accessMap.put("/sys/wxLogin.execute!login", "1");
		accessMap.put("/mobile/login.jsp", "1");
	}

	private void initConfig(){
		DBFoundConfig.getSensitiveParamSet().add("ypassword");
	}

}
