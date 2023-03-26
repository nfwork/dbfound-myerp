// pages/accountAmountlist/accountAmountlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      item_list:[],
      item_line_list:[],
      period_list:[],
      current_period: {}
  },

  query(){
    wx.showLoading({
      title: '正在加载中',
    })
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/report/accountAmountQuery.query',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        period_id: this.data.current_period.period_id
      },
      success : (res)=> {
        if(res.data.success){
          this.setData({
            item_list:res.data.datas,
            item_line_list:[]
          });
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      },
      complete:()=>{
        wx.hideLoading();
      }
    })
  },

  showDetail(e){
    let account_id = e.currentTarget.dataset.accountid;
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/report/accountAmountQuery.query!getExpDetail',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        account_id: account_id,
        period_id: this.data.current_period.period_id,
        order : "asc"
      },
      success : (res)=> {
        if(res.data.success){
          this.setData({
            item_line_list:res.data.datas
          });
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      }
    })
  },

  setPeriod(e){
    this.setData({current_period : e.detail});
    this.query();
  },

  getPeriodList(){
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/fnd/expPeriod.query!comboAll',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          this.setData({
            period_list:res.data.datas,
            current_period:res.data.datas[res.data.datas.length-1]
          });
          this.query();
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      }
    })
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
    this.getPeriodList();
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