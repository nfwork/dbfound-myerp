// pages/amountManager/amountManager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      item_list:[],
      item_line_list:[],
      period_list:[],
      current_period: {},
      showIndex: 0,
      account_id:"",
      account_name:"",
      description:"",
      amount:"",
      change_type:1
  },

  hiddenBox(){
    this.setData({
      showIndex:'0'
    })
  },

  setDescription(e){
    this.setData({description : e.detail.value});
  },

  showBox(e){
    this.setData({
      showIndex:'1',
      account_id: e.currentTarget.dataset.accountid,
      account_name: e.currentTarget.dataset.accountname
    })
  },

  itemChange(e){
    if(e.detail.value){
      this.setData({
        change_type: e.detail.value
      });
    }
  },

  initByLastMonth(){
    if(this.data.period_list.length == 0){
      wx.showToast({
        title: '当前没有打开过的期间',
        icon: "error"
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '导入之前会删除当前期间已有的预算数据，确定要导入吗？',
      complete: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'https://advtest.wecloud.io/dbfound/exp/amountManager.execute!initByLastMonth',
            header:{ "Cookie":wx.getStorageSync('cookies')},
            method:"POST",
            data:{
              period_id: this.data.current_period.period_id
            },
            success : (res)=> {
              if(res.data.success){
                wx.showModal({
                  title: '提示',
                  content: '预算初始化成功',
                  showCancel:false,
                  complete: (res) => {
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
          })
        }
      }
    })
  },

  saveChange(){
    if(!(this.data.amount)){
      wx.showToast({
        title: "金额不能为空！",
        icon: "error"
      })
      return;
    }
    if(!(this.data.description)){
      wx.showToast({
        title: "调整说明不能为空！",
        icon: "error"
      })
      return;
    }
    wx.request({
      url: 'https://advtest.wecloud.io/dbfound/exp/amountManager.execute!add',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        period_id: this.data.current_period.period_id,
        account_id: this.data.account_id,
        amount: this.data.amount * this.data.change_type,
        description: this.data.description
      },
      success : (res)=> {
        if(res.data.success){
          wx.showModal({
            title: '提示',
            content: '预算调整成功',
            showCancel:false,
            complete: (res) => {
              this.hiddenBox();
              this.query();
              this.setData({
                amount:"",
                description:""
              });
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
      url: 'https://advtest.wecloud.io/dbfound/exp/amountManager.query',
      header:{ "Cookie":wx.getStorageSync('cookies')},
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
          }
          json.append_amount = append_amount;
          res.data.datas.push(json);

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
      url: 'https://advtest.wecloud.io/dbfound/exp/amountManager.query!detail',
      header:{ "Cookie":wx.getStorageSync('cookies')},
      method:"POST",
      data:{
        account_id: account_id,
        period_id: this.data.current_period.period_id
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
      url: 'https://advtest.wecloud.io/dbfound/fnd/expPeriod.query!combo',
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