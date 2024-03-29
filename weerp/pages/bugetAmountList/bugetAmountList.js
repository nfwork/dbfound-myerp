// pages/bugetAmountList/bugetAmountList.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      platform:app.globalData.platform,
      item_list:[],
      item_line_list:[],
      period_list:[],
      current_period: {},
      current_line:-1
  },

  query(){
    if(this.data.period_list.length == 0){
      wx.showToast({
        title: '当前没有打开过的期间',
        icon: "error"
      })
      return;
    }
    wx.showLoading({
      title: '正在加载中',
    })
    wx.request({
      url: app.globalData.serverUrl +'/exp/amountManager.query',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      data:{
        period_id: this.data.current_period.period_id
      },
      success : (res)=> {
        if(res.data.success){
          let json={account_name:'合计'};
          let append_amount = 0;
          let emerge_amount = 0;
          let end_amount = 0;
          for(let i=0;i<res.data.datas.length;i++){
            append_amount = this.add(append_amount, res.data.datas[i].append_amount);
            emerge_amount = this.add(emerge_amount, res.data.datas[i].emerge_amount);
            end_amount = this.add(end_amount, res.data.datas[i].end_amount);
          }
          json.append_amount = append_amount;
          json.emerge_amount = emerge_amount;
          json.end_amount = end_amount;
          res.data.datas.push(json);

          this.setData({
            item_list:res.data.datas,
            current_line: -1,
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

  add(num1, num2) {
    let r1, r2, m;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return Math.round(num1 * m + num2 * m) / m;
  },

  showDetail(e){
    let account_id = e.currentTarget.dataset.accountid;
    wx.request({
      url: app.globalData.serverUrl +'/exp/amountManager.query!getExpDetail',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      data:{
        account_id: account_id,
        period_id: this.data.current_period.period_id,
        order : "asc"
      },
      success : (res)=> {
        if(res.data.success){
          this.setData({
            item_line_list:res.data.datas,
            current_line:e.currentTarget.dataset.index
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
      url: app.globalData.serverUrl +'/fnd/expPeriod.query!comboAll',
      header:{ "Cookie":app.globalData.cookies},
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