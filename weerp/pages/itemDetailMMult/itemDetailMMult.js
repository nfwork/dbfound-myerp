// pages/itemDetailMMult/itemDetailMMult.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      platform:app.globalData.platform,
      item_line_list:[],
      period_list:[],
      account_list:[],
      description: '',
      current_period: {},
      current_line_account: {},
      user_name:"",
      regist_time:"系统自动生成",
      item_num:"系统自动生成",
      item_id:"",
      showIndex:'0',
      line_index:-1,
      current_line:{}
  },

  save(){
    if(!this.data.current_period || !this.data.current_period.period_id){
      wx.showToast({title: '会计期间不能为空', icon: "error"})
      return;
    }
    if(this.data.item_line_list.length<2){
      wx.showToast({title: '凭证行不能为空', icon: "error"})
      return;
    }
    let dr_amount = 0;
    let cr_amount = 0;
    let datas = this.data.item_line_list;
		for (let i = 0; i < datas.length; i++) {
			let d_amount = datas[i].dr_amount;
			if (d_amount && d_amount != "" && d_amount !=null) {
				dr_amount = this.add(dr_amount, d_amount);
			}
			let c_amount = datas[i].cr_amount;
			if (c_amount && c_amount != "" && c_amount != null) {
				cr_amount = this.add(cr_amount, c_amount);
			}
		}
		if (dr_amount != cr_amount) {
			wx.showToast({title: "借贷不平，借方金额：" + dr_amount + "，贷方金额：" + cr_amount + "，请确认", icon: "error"});
			return;
    }
    wx.showLoading({
      title: '正在保存中',
    })
    wx.request({
      url: app.globalData.serverUrl +'/exp/item.execute!saveHeaderAndLine',
      header:{ "Cookie":app.globalData.cookies},
      data:{
        exp_time:this.data.exp_time,
        description:this.data.description,
        period_id:this.data.current_period.period_id,
        item_id:this.data.item_id,
        lines:this.data.item_line_list
      },
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '保存成功',
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
  
  query(){
   wx.request({
      url: app.globalData.serverUrl +'/exp/item.query!getDeatil',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      data:{
        item_id: this.data.item_id
      },
      success : (res)=> {
        if(res.data.success){
          this.setData({
            current_period: this.getPeriodById(res.data.datas[0].period_id),
            exp_time:res.data.datas[0].exp_time,
            description:res.data.datas[0].description,
            user_name:res.data.datas[0].add_user,
            regist_time:res.data.datas[0].regist_time,
            item_num:res.data.datas[0].item_num
          });
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
      }
    })
  },

  dateChange(e){
    this.setData({exp_time: e.detail.value})
  },
  updateLine(e){
    let data = this.data.item_line_list[e.currentTarget.dataset.index];
    this.setData({
      line_index: e.currentTarget.dataset.index,
      current_line_cr_amount: data.cr_amount ,
      current_line_description: data.description,
      current_line_dr_amount: data.dr_amount,
      current_line_account: {account_id:e.currentTarget.dataset.accountid,
                              account_name:e.currentTarget.dataset.accountname
                            }
    });
    this.showBox();
  },

  addLine(){
    this.setData({
      line_index: -1,
      current_line_account:{},
      current_line_dr_amount:"",
      current_line_cr_amount : "",
      current_line_description: ""
    });
    this.showBox();
  },

  saveLine(){
    if(!(this.data.current_line_account.account_id)){
      wx.showToast({
        title: "科目不能为空！",
        icon: "error"
      })
      return;
    }
    if(!(this.data.current_line_cr_amount && this.data.current_line_cr_amount !=0)
        &&!(this.data.current_line_dr_amount && this.data.current_line_dr_amount !=0)){
      wx.showToast({
        title: "借贷金额不能同时为空！",
        icon: "error"
      })
      return;
    }
    if((this.data.current_line_cr_amount && this.data.current_line_cr_amount !=0)
        &&(this.data.current_line_dr_amount && this.data.current_line_dr_amount !=0)){
      wx.showToast({
        title: "借贷金额不能同时有值！",
        icon: "error"
      })
      return;
    }
    let item_line_list = this.data.item_line_list;
    let current_line_cr_amount;
    if(this.data.current_line_cr_amount){
      current_line_cr_amount = Math.floor(this.data.current_line_cr_amount * 100) / 100;
    }
    let current_line_dr_amount;
    if(this.data.current_line_dr_amount){
      current_line_dr_amount = Math.floor(this.data.current_line_dr_amount * 100) / 100;
    }
    if(this.data.line_index == -1){
      item_line_list.push({
        cr_amount:current_line_cr_amount,
        dr_amount:current_line_dr_amount,
        description:this.data.current_line_description,
        account_id:this.data.current_line_account.account_id,
        account_name:this.data.current_line_account.account_name
      })
    }else{
      item_line_list[this.data.line_index].cr_amount = current_line_cr_amount;
      item_line_list[this.data.line_index].dr_amount = current_line_dr_amount;
      item_line_list[this.data.line_index].description = this.data.current_line_description;
      item_line_list[this.data.line_index].account_id = this.data.current_line_account.account_id;
      item_line_list[this.data.line_index].account_name = this.data.current_line_account.account_name;
    }
    this.setData({
      item_line_list:item_line_list
    });
    this.hiddenBox();
  },

  showBox(){
    this.setData({
      showIndex:'1'
    })
  },

  hiddenBox(){
    this.setData({
      showIndex:'0'
    })
  },

  showDetail(e){
    wx.request({
      url: app.globalData.serverUrl +'/exp/itemLine.query',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      data:{
        item_id: this.data.item_id,
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

  getPeriodById(id){
    for(let period of this.data.period_list){
      if(period.period_id == id){
        return period;
      }
    }
  },

  setPeriod(e){
    this.setData({current_period : e.detail});
  },

  setAccount(e){
    this.setData({current_line_account : e.detail});
  },

  setDescription(e){
    this.setData({description : e.detail.value});
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
      url: app.globalData.serverUrl +'/fnd/expPeriod.query!combo',
      header:{ "Cookie":app.globalData.cookies},
      method:"POST",
      success : (res)=> {
        if(res.data.success){
          this.setData({
            period_list:res.data.datas
          });
          if(this.data.item_id){
            this.query();
          }else{
            this.setData({
              current_period:res.data.datas[0]
            });
          }
        }else if(res.data.timeout){
          wx.navigateTo({url: "../login/login"});
        }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options){
      this.setData({
        item_id:options.item_id
      })
    }
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

    if(this.data.item_id){
      this.showDetail();
    }else{
      this.getBasic();
    }
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