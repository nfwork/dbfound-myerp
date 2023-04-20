// app.js
App({
  onLaunch() {
    //let result = await this.login();
    //console.log(result)
  },
  
  globalData: {
    isLogin : false,
    cookies : wx.getStorageSync('cookies'),
    serverUrl : "https://dbfound.3g.net.cn/dbfound"
  },
})
