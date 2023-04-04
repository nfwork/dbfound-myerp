// pages/periodAmountReport/periodAmountReport.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_list:[],
    column_list:[],
    pitems:[],
    periodfrom:"",
    periodto:""
  },

  query(){
    wx.showLoading({
      title: '正在加载中',
    })
    wx.request({
       url: 'https://dbfound.3g.net.cn/dbfound/report/periodAmountReport.query',
       header:{ "Cookie":wx.getStorageSync('cookies')},
       method:"POST",
       data:{
        periodfrom: this.data.periodfrom,
        periodto: this.data.periodto
       },
       success : (res)=> {
         if(res.data.success){

            let json={c:'合计'};
            for(let i=0;i<res.data.datas.length;i++){
              for(let j=0;j<res.data.columns.length;j++){
                var column = res.data.columns[j];
                var c = json[column.jsName];
                if(c==null){
                  c=0;
                  json[column.jsName]=c;
                }
                var cc= res.data.datas[i][column.jsName];
                if(cc>0){
                  json[column.jsName] = this.add(c,cc);
                }
              }
            }
            res.data.datas.push(json);
          
            this.setData({
              item_list:res.data.datas,
              column_list:res.data.columns
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

  itemChange(e){
    if(e.detail.value){
      this.setData({
        periodfrom: e.detail.value+"01",
        periodto: e.detail.value+"12"
      });
    }else{
      this.setData({
        periodfrom: "",
        periodto: ""
      });
    }
    
    this.query();
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

    let myDate = new Date();     
    let cyear=myDate.getFullYear();        //获取当前年
    let lastyear = cyear - 1;
    let lasttwoyear = cyear -2;
    let lastthreeyear = cyear -3;
	
	  let pitems = [{item_name: cyear+"年", item_value: cyear,selected:true},
	                 {item_name: lastyear + "年", item_value: lastyear,selected:false},
	                 {item_name: lasttwoyear + "年", item_value:lasttwoyear,selected:false},
	                 {item_name: lastthreeyear + "年", item_value:lastthreeyear,selected:false},
	                 {item_name:"全部", item_value:"",selected:false}
                   ];
    let pitem = pitems[0].item_value;
    this.setData({
      periodfrom: pitem+"01",
      periodto: pitem+"12",
      pitems
    });
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