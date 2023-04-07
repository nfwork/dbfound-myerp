// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_code: wx.getStorageSync('user_code'),
    password:""
  },

  login(e){
    wx.request({
      url: 'https://dbfound.3g.net.cn/dbfound/sys/login.execute',
      method:"POST",
      data:{
        user_code:this.data.user_code,
        password:this.data.password
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
          wx.setStorageSync('user_code', this.data.user_code);
          wx.switchTab({
            url: "../home/home"
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: "error"
          })
        }
      }
    })
  },

  register(){
    wx.showModal({
      title: '提示',
      content: 'We记账小程序暂不提供在线注册功能，如有需要请发送邮件到nfwork@163.com进行账号申请；',
      showCancel:false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})