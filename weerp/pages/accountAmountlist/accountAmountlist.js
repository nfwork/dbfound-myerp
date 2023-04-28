// pages/accountAmountlist/accountAmountlist.js
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
      limit : 5,
      totalCounts: 0,
      totalPages: 0,
      currentPage: 1,
      account_id:"",
      account_type:{},
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
      url: app.globalData.serverUrl + '/report/accountAmountQuery.query',
      header:{ "Cookie": app.globalData.cookies},
      method:"POST",
      data:{
        period_id: this.data.current_period.period_id,
        account_type: this.data.account_type.code_value
      },
      success : (res)=> {
        if(res.data.success){
          let json={account_name:'合计'};
          let remaind_amount = 0;
          let emerge_amount = 0;
          let end_amount = 0;
          for(let i=0;i<res.data.datas.length;i++){
            remaind_amount = this.add(remaind_amount, res.data.datas[i].remaind_amount);
            emerge_amount = this.add(emerge_amount, res.data.datas[i].emerge_amount);
            end_amount = this.add(end_amount, res.data.datas[i].end_amount);
          }
          json.remaind_amount = remaind_amount;
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

  reset(){
    this.setData({
      account_type: {}
    });
  },

  setAccountType(e){
    this.setData({account_type : e.detail});
    this.query();
  },

  getAccountTypeList(){
    wx.request({
      url: app.globalData.serverUrl +'/fnd/sourceCode.query',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      data:{
        code:"ACCOUNTTYPE"
      },
      success : (res)=> {
        if(res.data.success){
          this.setData({
            account_type_list:res.data.datas
          });
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      }
    })
  },

  showDetail(e){
    let account_id = e.currentTarget.dataset.accountid;
    this.setData({account_id:account_id,
                  current_line:e.currentTarget.dataset.index,
                  currentPage:1
                });
    this.queryDetail();
  },

  queryDetail(){
    wx.request({
      url: app.globalData.serverUrl +'/report/accountAmountQuery.query!getExpDetail',
      header:{ "Cookie": app.globalData.cookies},
      method:"POST",
      data:{
        account_id: this.data.account_id,
        limit: this.data.limit,
        start : (this.data.currentPage - 1) * this.data.limit,
        period_id: this.data.current_period.period_id,
        order : "asc"
      },
      success : (res)=> {
        if(res.data.success){
          this.setData({
            item_line_list:res.data.datas,
            totalCounts:res.data.totalCounts,
            totalPages: Math.ceil(res.data.totalCounts/this.data.limit)
          });
          this.checkPage();
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
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
      this.queryDetail();
    }
  },

  changePage(e){
    let type = e.currentTarget.dataset.type;
    if(type==1){
      if(this.data.currentPage > 1){
        this.setData({currentPage:1});
        this.queryDetail();
      }
    }else if(type==2){
      if(this.data.currentPage > 1){
        this.setData({currentPage:this.data.currentPage-1})
        this.queryDetail();
      }
    }else if(type==3){
      if(this.data.currentPage * this.data.limit < this.data.totalCounts){
        this.setData({currentPage:this.data.currentPage+1});
        this.queryDetail();
      }
    }else if(type==4){
      if(this.data.currentPage * this.data.limit < this.data.totalCounts){
        this.setData({currentPage:Math.ceil(this.data.totalCounts/this.data.limit)});
        this.queryDetail();
      }
    }
  },

  setPeriod(e){
    this.setData({current_period : e.detail});
    this.query();
  },

  getPeriodList(){
    wx.request({
      url: app.globalData.serverUrl +'/fnd/expPeriod.query!comboAll',
      header:{ "Cookie": app.globalData.cookies},
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
    this.getAccountTypeList();
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