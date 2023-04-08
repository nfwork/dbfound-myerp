// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      user_name:"",
      totalexp:0,
      accounts_exp:[],
      inited:false
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

  async init(){
    wx.showLoading({
      title: '正在加载中',
    })
    let code = await this.getJsCode();
    let result = await this.wxLogin(code);
    result = await this.getHomeAnalysis();
    this.setData({inited:true});
    wx.hideLoading();
  },

  getJsCode(){
    return new Promise((resolve,reject)=>{
      wx.login({
        success: res => {
          resolve(res.code)
        }
      })
    });
  },

  wxLogin(jsCode){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: 'https://dbfound.3g.net.cn/dbfound/sys/wxLogin.execute!login',
        header:{ "Cookie":wx.getStorageSync('cookies')},
        method:"POST",
        data:{
          js_code: jsCode 
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
            wx.setStorageSync('user_code', res.data.outParam.user_code);
          }
        },
        complete : () =>{
          resolve(1);
        }
      })
    });
  },

  getHomeAnalysis(){
    return new Promise((resolve,reject)=>{
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
        },
        complete : () =>{
          resolve(1);
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init();
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
    if(this.data.inited){
      this.getHomeAnalysis();
    }
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