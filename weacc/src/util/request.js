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

request.interceptors.request.use(config => {
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
})

request.interceptors.response.use(res => {
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
})

export default request;