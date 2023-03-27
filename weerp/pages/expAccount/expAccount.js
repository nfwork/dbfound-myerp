// pages/expAccount/expAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      item_list:[],
      account_name:'',
      limit : 10,
      totalCounts: 0,
      totalPages: 0,
      currentPage: 1,
      showIndex: 0,
      line_index: -1,
  },

  reset(){
    this.setData({
      account_name: ''
    });
  },

  hiddenBox(){
    this.setData({
      showIndex:'0'
    })
  },

  showBox(){
    this.setData({
      showIndex:'1'
    })
  },

  setDisplay(e){
    this.setData({
      current_line_display_in_home : e.detail.value?1:0
    })
  },

  addLine(){
    this.setData({
      line_index: -1,
      current_line_account_name: null,
      current_line_account_type: null,
      current_line_priority: null,
      current_line_display_in_home: null
    });
    this.showBox();
  },

  updateAccount(e){
    let data = this.data.item_list[e.currentTarget.dataset.index];
    this.setData({
      line_index: e.currentTarget.dataset.index,
      current_line_account_name: data.account_name ,
      current_line_account_type: {
         code_value: data.account_type,
         code_name : data.account_type_des
      },
      current_line_priority: data.priority,
      current_line_display_in_home: data.display_in_home
    });
    this.showBox();
  },

  saveAccount(){
    if(!(this.data.current_line_account_name)){
      wx.showToast({
        title: "科目名称不能为空！",
        icon: "error"
      })
      return;
    }
    if(!(this.data.current_line_account_type)){
      wx.showToast({
        title: "科目类型不能为空！",
        icon: "error"
      })
      return;
    }
    let account_id ;
    let type = 'add';
    if(this.data.line_index > -1){
      account_id = this.data.item_list[this.data.line_index].account_id;
      type = "update";
    }
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/fnd/expAccount.execute!'+ type,
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        account_id: account_id,
        account_name: this.data.current_line_account_name,
        account_type: this.data.current_line_account_type.code_value,
        display_in_home: this.data.current_line_display_in_home,
        priority: this.data.current_line_priority
      },
      success : (res)=> {
        if(res.data.success){
          if(res.data.success){
            wx.showModal({
              title: '提示',
              content: '保存成功',
              showCancel:false,
              complete: (res) => {
                this.hiddenBox();
                this.query();
              }
            })
          }else{
            wx.showToast({
              title: res.data.message,
              icon: "error"
            })
          }
        }
      }
    })
    
  },

  query(){
   wx.request({
      url: 'https://advtest.wecloud.io/dbfound/fnd/expAccount.query',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        limit : this.data.limit,
        start : (this.data.currentPage - 1) * this.data.limit,
        account_name: "%"+this.data.account_name+"%"
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

  setAccountType(e){
    this.setData({current_line_account_type : e.detail});
  },

  getAccountTypeList(){
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/fnd/sourceCode.query',
      header:{ "Cookie":wx.getStorageSync('cookies')},
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