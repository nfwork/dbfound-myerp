package com.nfwork.erp.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CorsFilter implements Filter {
 
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse res = (HttpServletResponse) response;
 
        // 允许所有源访问
        res.setHeader("Access-Control-Allow-Origin", "*");
        // 允许的HTTP方法
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        // 允许的头信息字段
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, api_key, Authorization");
        // 是否允许携带认证信息
        res.setHeader("Access-Control-Allow-Credentials", "true");
 
        chain.doFilter(request, response);
    }

}