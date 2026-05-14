import axios from 'axios';
import router from '../router';
import { Toast } from 'vant';

const request = axios.create({
  baseURL: "https://dbfound.3g.net.cn/dbfound/",
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

function getResponseData(response) {
  let data = response.data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
  return data;
}

function getKnownResponseMessage(response) {
  if (!response || !response.data) {
    return "";
  }
  let data = getResponseData(response);
  return data && typeof data === "object" ? data.message || "" : "";
}

function appendHttpCode(message, response) {
  if (!response || !response.status) {
    return message;
  }
  return message + "（HTTP " + response.status + "）";
}

function getErrorMessage(error) {
  let knownMessage = getKnownResponseMessage(error.response);
  if (knownMessage) {
    return {
      message: knownMessage,
      known: true
    };
  }
  if (error.response && error.response.status === 502) {
    return {
      message: "服务暂时不可用，请稍后再试",
      known: false
    };
  }
  if (error.message === "Network Error") {
    return {
      message: "后端接口连接异常",
      known: false
    };
  }
  if (error.message && error.message.includes("timeout")) {
    return {
      message: "系统接口请求超时",
      known: false
    };
  }
  return {
    message: "系统接口请求异常",
    known: false
  };
}

request.interceptors.request.use(
  config => {
    if(!request.jsessionid){
      request.jsessionid = localStorage.getItem("jsessionid");
    }
    let url = config.url;
    let index = url.indexOf("?");
    if(index>0){
      config.url = url.substring(0,index) +';jsessionid=' + request.jsessionid + url.substring(index); 
    }else{
      config.url = url +';jsessionid=' + request.jsessionid; 
    }
    if(config.showLoadding){
      Toast.loading({
        duration: 0,
        message: '请求中...',
        forbidClick: true
      });
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  res => {
    if(res.config.showLoadding){
      Toast.clear();
    }
    let jsessionid = res.headers["jsessionid"];
    if(jsessionid && jsessionid != request.jsessionid){
      request.jsessionid = jsessionid;
      localStorage.setItem("jsessionid",jsessionid);
    }
    if(res.data.timeout){
      router.push("/login");
    }
    return res;
  },
  error => {
    if(error.config && error.config.showLoadding){
      Toast.clear();
    }
    let errorInfo = getErrorMessage(error);
    Toast.fail(errorInfo.known ? errorInfo.message : appendHttpCode(errorInfo.message, error.response));
    return Promise.reject(error);
  }
)

export default request;