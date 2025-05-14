package com.nfwork.erp.controller;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.ResponseObject;
import com.nfwork.dbfound.web.base.ActionController;
import com.nfwork.dbfound.web.base.ActionMapping;

@ActionMapping("user")
public class UserController implements ActionController {

    public ResponseObject logout(Context context){
        context.request.getSession().invalidate();
        ResponseObject responseObject = new ResponseObject();
        responseObject.setSuccess(true);
        responseObject.setMessage("success");
        return responseObject;
    }

    public ResponseObject keepLogin(Context context){
        context.request.getSession().setMaxInactiveInterval(60 * 60 * 24 * 7);
        ResponseObject responseObject = new ResponseObject();
        responseObject.setSuccess(true);
        responseObject.setMessage("success");
        return responseObject;
    }
}
