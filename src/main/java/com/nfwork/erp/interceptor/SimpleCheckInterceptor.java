package com.nfwork.erp.interceptor;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.util.DataUtil;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.WebWriter;
import com.nfwork.dbfound.web.base.Interceptor;

public class SimpleCheckInterceptor implements Interceptor {

	private static final String LOGIN_USER_AGENT = "login_user_agent";
	private static final String DEVICE_ID = "device_id";
	private static final String DEVICE_ID_HEADER = "X-Device-Id";

	Map<String, String> accessMap;

	public boolean jspInterceptor(HttpServletRequest request,
								  HttpServletResponse response) throws Exception {
		if (isAccessAllowed(request)) {
			return true;
		}
		String page = request.getServletPath().startsWith("/mobile/")
				? "/mobile/login.jsp" : "/sessionExpire.jsp";
		request.getRequestDispatcher(page).forward(request, response);
		return false;
	}

	private boolean commonInterceptor(Context context){
		HttpServletRequest request = context.request;
		boolean loggedIn = request.getSession().getAttribute("user_id") != null;
		if (isAccessAllowed(request)) {
			return true;
		}
		writeTimeout(context, loggedIn ? "登录环境发生变化，请重新登录" : "session超时或未登录");
		return false;
	}

	private boolean isAccessAllowed(HttpServletRequest request) {
		HttpSession session = request.getSession();
		Object user_id = session.getAttribute("user_id");
		if (user_id == null) {
			return check(request.getServletPath());
		}
		if (hasDeviceId(session)) {
			if (deviceIdChanged(session, request)) {
				session.invalidate();
				return false;
			}
			return true;
		}
		if (userAgentChanged(session, request)) {
			session.invalidate();
			return false;
		}
		return true;
	}

	private void writeTimeout(Context context, String message) {
		Map<String,Object> map = new HashMap<>();
		map.put("timeout", true);
		map.put("message", message);
		map.put("success", false);
		WebWriter.jsonWriter(context.response, JsonUtil.toJson(map));
	}

	private boolean hasDeviceId(HttpSession session) {
		Object saved = session.getAttribute(DEVICE_ID);
		return saved != null && DataUtil.isNotNull(String.valueOf(saved));
	}

	private boolean deviceIdChanged(HttpSession session, HttpServletRequest request) {
		String current = request.getHeader(DEVICE_ID_HEADER);
		return current == null || !String.valueOf(session.getAttribute(DEVICE_ID)).equals(current);
	}

	private boolean userAgentChanged(HttpSession session, HttpServletRequest request) {
		Object saved = session.getAttribute(LOGIN_USER_AGENT);
		if (saved == null) {
			return true;
		}
		String ua = request.getHeader("User-Agent");
		return !String.valueOf(saved).equals(ua == null ? "" : ua);
	}

	@Override
	public void setCors(HttpServletRequest request, HttpServletResponse response) {
		String origin = request.getHeader("Origin");
		if(DataUtil.isNotNull(origin)) {
			response.setHeader("Access-Control-Allow-Origin", origin);
			response.setHeader("Vary", "Origin");
			response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
			response.setHeader("Access-Control-Max-Age", "1800");
			response.setHeader("Access-Control-Allow-Credentials", "true");
			response.addHeader("Access-Control-Allow-Headers", "Content-Type, X-Device-Id");
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
