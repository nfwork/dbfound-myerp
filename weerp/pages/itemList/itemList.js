// pages/itemList/itemList.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      item_list:[],
      item_line_list:[],
      period_list:[],
      account_list:[],
      limit : 5,
      totalCounts: 0,
      totalPages: 0,
      currentPage: 1,
      description: '',
      current_period: {},
      current_account: {}
  },

  reset(){
    this.setData({
      description: '',
      current_period: {},
      current_account: {}
    });
  },

  query(){
    wx.showLoading({
      title: '正在加载中',
    })
    wx.request({
      url: app.globalData.serverUrl +'/exp/item.query',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      data:{
        period_id: this.data.current_period.period_id,
        account_id: this.data.current_account.account_id,
        limit : this.data.limit,
        description : this.data.description,
        start : (this.data.currentPage - 1) * this.data.limit
      },
      success : (res)=> {
        if(res.data.success){
          this.setData({
            item_list:res.data.datas,
            item_line_list:[],
            totalCounts:res.data.totalCounts,
            totalPages: Math.ceil(res.data.totalCounts/this.data.limit)
          });
          this.checkPage();
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      },
      complete:()=>{
        wx.hideLoading();
      }
    })
  },


  checkPage(){
    if(this.data.currentPage > 1 &&this.data.currentPage > this.data.totalPages){
      if(this.data.totalPages < 2){
        this.setData({currentPage:1});
      }else{
        this.setData({currentPage:this.data.totalPages});
      }
      this.query();
    }
  },

  showDetail(e){
    let item_id = e.currentTarget.dataset.itemid;
    wx.request({
      url: app.globalData.serverUrl +'/exp/itemLine.query',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      data:{
        item_id: item_id,
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

  changePage(e){
    let type = e.currentTarget.dataset.type;
    if(type==1){
      if(this.data.currentPage > 1){
        this.setData({currentPage:1});
        this.query();
      }
    }else if(type==2){
      if(this.data.currentPage > 1){
        this.setData({currentPage:this.data.currentPage-1})
        this.query();
      }
    }else if(type==3){
      if(this.data.currentPage * this.data.limit < this.data.totalCounts){
        this.setData({currentPage:this.data.currentPage+1});
        this.query();
      }
    }else if(type==4){
      if(this.data.currentPage * this.data.limit < this.data.totalCounts){
        this.setData({currentPage:Math.ceil(this.data.totalCounts/this.data.limit)});
        this.query();
      }
    }
  },
  setPeriod(e){
    this.setData({current_period : e.detail});
  },
  setAccount(e){
    this.setData({current_account : e.detail});
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

  getPeriodList(){
    wx.request({
      url: app.globalData.serverUrl +'/fnd/expPeriod.query!comboAll',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          this.setData({
            period_list:res.data.datas
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

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : `0${n}`
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