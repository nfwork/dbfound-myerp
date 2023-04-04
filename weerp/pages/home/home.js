// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      user_name:"",
      totalexp:0,
      accounts_exp:[]
  },

  menuTap(e){
    if(e.currentTarget.dataset.fid == 1){
      wx.switchTab({url: "../itemListManager/itemListManager"});
    }else if(e.currentTarget.dataset.fid == 2){
      wx.navigateTo({url: "../itemDetailM/itemDetailM"});
    }else if(e.currentTarget.dataset.fid == 3){
      wx.navigateTo({url: "../itemDetailMMult/itemDetailMMult"});
    }else if(e.currentTarget.dataset.fid == 4){
      wx.navigateTo({url: "../itemList/itemList"});
    }else if(e.currentTarget.dataset.fid == 5){
      wx.navigateTo({url: "../bugetAmountList/bugetAmountList"});
    }else if(e.currentTarget.dataset.fid == 6){
        wx.navigateTo({url: "../accountAmountlist/accountAmountlist"});
    }else if(e.currentTarget.dataset.fid == 7){
      wx.navigateTo({url: "../periodAmountReport/periodAmountReport"});
    }else if(e.currentTarget.dataset.fid == 8){
      wx.navigateTo({url: "../expPeriod/expPeriod"});
    }else if(e.currentTarget.dataset.fid == 9){
      wx.navigateTo({url: "../expAccount/expAccount"});
    }else if(e.currentTarget.dataset.fid == 10){
      wx.navigateTo({url: "../amountManager/amountManager"});
    }
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
    wx.request({
      url: 'https://dbfound.3g.net.cn/dbfound/report/homeAnalysis.query',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      success : (res)=> {
        if(res.data.success){
          let totalAccount = res.data.datas.shift();
          this.setData({
            user_name:res.data.outParam.user_name,
            accounts_exp:res.data.datas,
            totalexp:totalAccount.totalexp
          });
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      }
    })
  },

  getPhoneNumber (e) {
    console.log(e)
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