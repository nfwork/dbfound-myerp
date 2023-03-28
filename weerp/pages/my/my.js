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
    period:"",
    showIndex: 0,
    ypassword:"",
    password:"",
    password2:""
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

  logout(){
    wx.showModal({
      title: '提示',
      content: '确认要退出吗？',
      complete: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('cookies');
          wx.navigateTo({url: "../login/login"});
        }
      }
    })
  },

  hiddenBox(){
    this.setData({
      showIndex:'0'
    })
  },

  showBox(e){
    this.setData({
      showIndex:'1'
    })
  },

  updatePassword(){
    if(!(this.data.ypassword)){
      wx.showToast({
        title: "原密码不能为空！",
        icon: "error"
      })
      return;
    }
    if(!(this.data.password) || this.data.password != this.data.password2){
      wx.showToast({
        title: "两次输入新密码不一致！",
        icon: "error"
      })
      return;
    }
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/sys/login.execute!updatePassword',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        password: this.data.password,
        ypassword: this.data.ypassword
      },
      success : (res)=> {
        if(res.data.success){
          wx.showModal({
            title: '提示',
            content: '密码修改成功',
            showCancel:false,
            complete: (res) => {
              this.setData({
                ypassword:"",
                password2:"",
                password:""
              });
              this.hiddenBox();
            }
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
    this.getBasic();
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