// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_code:"",
    user_name:"",
    role_code:"",
    role_description:"",
    exp_time:"",
    period:""
  },

  getBasic(){
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/exp/public.query!getDefaultPeriod',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          this.setData({
            user_name:res.data.outParam.user_name,
            user_code:res.data.outParam.user_code,
            role_code:res.data.outParam.role_code,
            role_description:res.data.outParam.role_description,
            exp_time:res.data.datas[0].exp_time,
            period:res.data.datas[0].period
          });
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
    this.getBasic();
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