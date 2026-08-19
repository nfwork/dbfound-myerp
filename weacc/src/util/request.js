import axios from 'axios';
import router from '../router';
import { Toast } from 'vant';
import { getDeviceId } from './device';
import { appendJsessionid, saveJsessionid, clearJsessionid } from './jsessionid';

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
    config.headers["X-Device-Id"] = getDeviceId();
    config.url = appendJsessionid(config.url);
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
    let data = getResponseData(res);
    let jsessionid = data && data.outParam && data.outParam.jsessionid;
    if (jsessionid) {
      saveJsessionid(jsessionid);
    }
    if(data && data.timeout){
      clearJsessionid();
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