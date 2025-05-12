package com.nfwork.erp.mq;

public class MQMessageException extends RuntimeException {

    Object data;

    public MQMessageException(Object object) {
        this.data = object;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
