import axios from 'axios';

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
  return config
})

request.interceptors.response.use(res => {
  let jsessionid = res.headers["jsessionid"];
  if(jsessionid && jsessionid != request.jsessionid){
    request.jsessionid = jsessionid;
    localStorage.setItem("jsessionid",jsessionid);
  }
  return res;
})

export default request;