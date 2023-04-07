package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.model.adapter.ExecuteAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.util.LogUtil;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.Map;

public class WxBindAdapter implements ExecuteAdapter {

    private static final String wxUrl = "https://api.weixin.qq.com/sns/jscode2session?appid=wxfa58bc877acba9c8&secret=%s&js_code=%s&grant_type=authorization_code" ;

    private static String wxs ;

    @Override
    public void beforeExecute(Context context, Map<String, Param> params) {
        String openid = getOpenId(context,params.get("js_code").getValue().toString());
        LogUtil.info("get openid jscode:" + params.get("js_code").getValue() +", openid:"+openid);
        params.get("openid").setValue(openid);
    }

    protected String getOpenId(Context context ,String jscode){
        try {
            if(wxs ==null) {
                Map map = (Map) ModelEngine.query(context,"sys/wxLogin",null).getDatas().get(0);
                wxs = map.get("wxs").toString();
            }
            HttpClient httpClient = HttpClients.createDefault();
            HttpGet httpGet = new HttpGet( String.format(wxUrl, wxs, jscode) );
            HttpResponse response = httpClient.execute(httpGet);
            String res =  EntityUtils.toString(response.getEntity());
            return JsonUtil.jsonToMap(res).get("openid").toString();
        } catch (IOException e) {
            LogUtil.error(e.getMessage(),e);
            return null;
        }
    }
}
