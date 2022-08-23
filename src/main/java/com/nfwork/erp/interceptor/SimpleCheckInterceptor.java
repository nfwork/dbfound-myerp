package com.nfwork.erp.interceptor;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.WebWriter;
import com.nfwork.dbfound.web.base.Interceptor;

public class SimpleCheckInterceptor implements Interceptor {

	Map<String, String> map;

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
				WebWriter.jsonWriter(context.response, JsonUtil.mapToJson(map));
				return false;
			}
		} else {
			return true;
		}
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
		return map.get(url) != null;
	}

	public void init() {
		map = new HashMap<>();
		map.put("/login.jsp", "1");
		map.put("/relogin.jsp", "1");
		map.put("/close.jsp", "1");
		map.put("/loginWindow.jsp", "1");
		map.put("/sys/login.execute", "1");
		
		map.put("/mobile/login.jsp", "1");
	}

}
