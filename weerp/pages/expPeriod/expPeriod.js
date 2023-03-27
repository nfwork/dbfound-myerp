// pages/expPeriod/expPeriod.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      item_list:[],
      period_code:'',
      limit : 10,
      totalCounts: 0,
      totalPages: 0,
      currentPage: 1,
  },

  reset(){
    this.setData({
      period_code: ''
    });
  },

  changeStatus(e){
    let dataset = e.currentTarget.dataset;
    let status = 'Y'
    if(dataset.status=='Y'){
      status = 'N';
    }
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/fnd/expPeriod.execute!' + (status=='Y'?"open":"close"),
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        period_id: dataset.periodid,
        status
      },
      success : (res)=> {
        wx.showToast({
          title: status=='Y'?"期间打开成功":'期间关闭成功',
          icon:"success"
        })
        this.query();
      }
    })
  },

  query(){
   wx.request({
      url: 'https://advtest.wecloud.io/dbfound/fnd/expPeriod.query',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        limit : this.data.limit,
        start : (this.data.currentPage - 1) * this.data.limit,
        period_code: this.data.period_code
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
    this.query();
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