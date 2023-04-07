// app.js
App({
  onLaunch() {
    wx.login({
      success: res => {
        wx.request({
          url: 'https://dbfound.3g.net.cn/dbfound/sys/wxLogin.execute!login',
          header:{ "Cookie":wx.getStorageSync('cookies')},
          method:"POST",
          data:{
            js_code: res.code 
          },
          success : (res)=> {
            if(res.data.success){
              let cookieString = "";
              if(res.cookies.length >0){
                for(const index in res.cookies){
                  cookieString = cookieString + res.cookies[index] +";"
                }
              }
              wx.setStorageSync('cookies', cookieString);
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  },
})
