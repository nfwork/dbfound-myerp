package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.model.adapter.ExecuteAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.util.LogUtil;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.util.Timeout;

import java.io.IOException;
import java.util.Map;

public class WxBindAdapter implements ExecuteAdapter {

    private static final String wxUrl = "https://api.weixin.qq.com/sns/jscode2session?appid=wxfa58bc877acba9c8&secret=%s&js_code=%s&grant_type=authorization_code" ;

    private static String wxs ;

    @Override
    public void beforeExecute(Context context, Map<String, Param> params) {
        String jsCode = params.get("js_code").getStringValue();
        String openid = getOpenId(context, jsCode);
        LogUtil.info("get openid jsCode:" + jsCode +", openid:"+openid);
        params.get("openid").setValue(openid);
    }

    protected String getOpenId(Context context ,String jsCode){
        try {
            if(wxs ==null) {
                wxs = ModelEngine.query(context,"sys/wxLogin",null).getString("wxs");
            }
            HttpGet httpGet = new HttpGet(String.format(wxUrl, wxs, jsCode));
            try(CloseableHttpClient httpClient = HttpClients.createDefault()){

                RequestConfig config = RequestConfig.custom().setConnectTimeout(Timeout.ofSeconds(10))
                        .setConnectionRequestTimeout(Timeout.ofSeconds(10))
                        .setResponseTimeout(Timeout.ofSeconds(10))
                        .build();
                httpGet.setConfig(config);

                ClassicHttpResponse response = httpClient.execute(httpGet);
                String res = EntityUtils.toString(response.getEntity());
                response.close();
                return JsonUtil.jsonToMap(res).get("openid").toString();
            }
        } catch (IOException | ParseException e) {
            LogUtil.error(e.getMessage(),e);
            throw new RuntimeException("获取openid失败");
        }
    }
}
