// app.js
App({
  onLaunch() {
    let sysInfo = wx.getSystemInfoSync();
    if(sysInfo.platform == 'android'){
      this.globalData.platform = 'android';
    }else{
      this.globalData.platform = 'ios';
    }
  },
  
  globalData: {
    platform : "ios",
    isLogin : false,
    cookies : wx.getStorageSync('cookies'),
    serverUrl : "https://dbfound.3g.net.cn/dbfound"
  },
})
