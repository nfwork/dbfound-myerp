// pages/itemDetailM/itemDetailM.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    platform:app.globalData.platform,
    item_num:"系统自动生成",
    description:"",
    period_list:[],
    cr_account:{},
    dr_account:{},
    current_period:{},
    amount:'',
    exp_time:'',
    user_name:''
  },

  setDate(e){
    this.setData({exp_time:e.detail.value})
  },

  setDrAccount(e){
    this.setData({dr_account : e.detail});
  },
  setCrAccount(e){
    this.setData({cr_account : e.detail});
  },
  setPeriod(e){
    this.setData({current_period : e.detail});
  },

  setDescription(e){
    this.setData({description : e.detail.value});
  },

  dateChange(e){
    this.setData({exp_time: e.detail.value})
  },

  save(){
    if(!this.data.current_period || !this.data.current_period.period_id){
      wx.showToast({title: '会计期间不能为空', icon: "error"})
      return;
    }
    wx.showLoading({
      title: '正在保存中',
    })
    let amount;
    if(this.data.amount && this.data.amount != 0){
      amount = Math.floor(this.data.amount * 100) / 100;
    }else{
      wx.showToast({title: '金额不能为空', icon: "error"});
      return;
    }
    wx.request({
      url: app.globalData.serverUrl +'/exp/item.execute!simpleSave',
      header:{ "Cookie":app.globalData.cookies},
      data:{
        exp_time:this.data.exp_time,
        description:this.data.description,
        amount:amount,
        period_id:this.data.current_period.period_id,
        cr_account_id:this.data.cr_account.account_id,
        dr_account_id:this.data.dr_account.account_id
      },
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '保持成功',
            showCancel:false,
            complete: (res) => {
              if (res.confirm) {
                wx.switchTab({url: "../itemListManager/itemListManager"});
              }
            }
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: "error"
          })
        }
      },
      fail:()=>{
        wx.hideLoading();
        wx.showToast({
          title: '请求失败'
        })
      }
    })
  },

  getPeriodList(){
    wx.request({
      url: app.globalData.serverUrl +'/fnd/expPeriod.query!combo',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          this.setData({
            period_list:res.data.datas,
            current_period:res.data.datas[0]
          });
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      }
    })
  },

  getAccountList(){
    wx.request({
      url: app.globalData.serverUrl +'/fnd/expAccount.query',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          this.setData({
            account_list:res.data.datas
          });
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      }
    })
  },

  getBasic(){
    wx.request({
      url: app.globalData.serverUrl +'/exp/public.query!getDefaultPeriod',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          this.setData({
            user_name:res.data.outParam.user_name,
            exp_time:res.data.datas[0].exp_time
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
    this.getAccountList();
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