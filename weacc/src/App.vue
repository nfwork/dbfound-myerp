<template>
  <div id="app">
    <div class="navbar">
      <div class="navbar-inner">
        <div v-show="showBack" @click="goback()" class="facing-left"/>
        {{title}}
      </div>
    </div>
    <div :style="'height:'+height+'px'" class="content">
       <keep-alive>
        <router-view></router-view>
       </keep-alive>
    </div>
    <div class="tabbar" :style="'padding-bottom:' + tabPadding +'px'">
      <div class="tabbar-inner">
        <div @click="changeTab('/')">
          <img :src="path=='/'?'images/sy-a.jpg':'images/sy.jpg'">
          <div :class="path=='/'?'active-img':''" >首页</div>
        </div>
        <div @click="changeTab('/itemManage')">
          <img :src="path=='/itemManage'?'images/jz-a.jpg':'images/jz.jpg'">
          <div :class="path=='/itemManage'?'active-img':''" >记账</div>
        </div>
        <div @click="changeTab('/my')">
          <img :src="path=='/my'?'images/wd-a.jpg':'images/wd.jpg'">
          <div :class="path=='/my'?'active-img':''" >我的</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function(){
    return {
       height: 0,
       path : "/",
       isIos : false,
       isPwa : false,
       tabPadding : 0,
       title : "We记账-首页",
       paths : {"/":{title:"We记账-首页"},
                "/my":{title:"We记账-我的"},
                "/itemManage":{title:"We记账-凭证管理"},
                "/itemQuery":{title:"We记账-凭证查询"},
                "/itemDetailAdd":{title:"We记账-凭证登记(简)"},
                "/itemDetailSave":{title:"We记账-凭证登记"},
                "/budgetAmount":{title:"We记账-费用明细"},
                "/accountAmount":{title:"We记账-科目余额"},
                "/periodAmount":{title:"We记账-开销汇总"},
                "/login":{title:"We记账-登录"}
                }
    }
  },
  methods: {
    changeTab(path,falg){
      if(this.path == path){
        return;
      }
      let pathEntity = this.paths[path];
      if(pathEntity){
        this.path = path;
        this.title = pathEntity.title;
        if(falg){
          return;
        }
        this.$router.replace({ path: path });
      }
    },
    goback(){
      this.$router.back();
    },
    handleResize(){
      this.height = document.documentElement.clientHeight - 101 - this.tabPadding;
    },
    isPwaModel() {
      return navigator.standalone === true || (window.matchMedia('(display-mode: standalone)').matches);
    },
    isIPhone(){
      let isEquipment = navigator.userAgent.toLowerCase()
      return isEquipment.indexOf("iphone")> 0;
    }
  },
  computed:{
      showBack(){
        let path = this.path;
        return path != "/" && path != "/itemManage" && path !="/my" && path != "/login";
      }
  },
  watch:{
    '$route': {
      handler: function (to, from) {
        let path = to.path;
        if(!path){
          path ="/";
        }
        this.changeTab(path,true);
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.isIos = this.isIPhone();
    this.isPwa = this.isPwaModel();
    if(this.isIos && this.isPwa){
      this.tabPadding = 20;
    }
    this.height = document.documentElement.clientHeight - 101 - this.tabPadding;
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Monospace", "Arial", "Source Han Sans CN", "Helvetica Neue", "Helvetica",sans-serif;
  }

  #app{
    display: flex;
    justify-content: center;
    background-color: #fff;
  }

  .navbar{
    background-color: #428bca;
    height: 50px;
    width: 100%;
    color: #efefef;
    font-size: 18px;
    font-weight: bolder;
    line-height: 50px;
    position: fixed;
    display: flex;
    justify-content: center;
    z-index: 10000;
    top: 0;
  }

  .navbar-inner{
    width: 100%;
    max-width: 600px;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .facing-left {
    border-left: 2px solid; border-bottom: 2px solid;
    width: 12px; height: 12px;
    transform: rotate(45deg);
    position: absolute;
    left: 18px;
    top: 19px;
  }

  .content{
    position: fixed;
    top: 50px;
    overflow-y: auto;
    padding-right: 10px;
    padding-left: 10px;
    display: flex;
    max-width: 600px;
    justify-content: center;
    align-items: flex-start;
    background-color: #fff;
  }

  .tabbar{
    position: fixed;
    bottom: 0;
    height: 50px;
    box-sizing: content-box;
    width: 100%;
    color: #000000;
    background-color: #fefefe;
    display: flex;
    justify-content: center;
    border-top: 1px solid #cbc6c6;
    z-index: 10000;
  }

  .tabbar-inner{
    width: 100%;
    max-width: 600px;
    display: flex;
    justify-content: space-around;
  }

  .tabbar-inner div{
    width: 70px;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .tabbar img{
    width: 30px;
    height: 30px;
  }

  .active-img{
    color: #426bea;
  }

.root{
  padding-top: 5px;
  padding-bottom: 10px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.box button{
  margin: 3px 4px;
  min-width: 85px;
}

.bule-button {
  background-image: linear-gradient(to bottom,#428bca 0,#2d6ca2 100%);
  background-repeat: repeat-x;
  border-color: #2b669a;
  color: #fff;
  margin-top: 10px;
  display: block;
  height: 32px;
}

.bule-button:active {
  background-image: linear-gradient(to bottom,#7fb6e7 0,#4993d3 100%);
}

.litter-bule-button {
  background-image: linear-gradient(to bottom,#5bc0de 0,#2aabd2 100%);
  background-repeat: repeat-x;
  border-color: #4f8dc3;
  color: #fff;
  margin-top: 10px;
  display: block;
  height: 32px;
}

.litter-bule-button:active{
  background-image: linear-gradient(to bottom,#7ccee7 0,#3db1d4 100%);
}

.yellow-button {
  background-image: linear-gradient(to bottom,#f0ad4e 0,#eb9316 100%);
  background-repeat: repeat-x;
  border-color: #e38d13;
  color: #fff;
  margin-top: 10px;
  display: block;
   height: 32px;
}
.yellow-button:active {
  background-image: linear-gradient(to bottom,#f3bf76 0,#e7a64a 100%);
}

button,input, textarea{
  height: 34px;
  padding: 5px 5px;
  font-size: 14px;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
}

.my-select{
  flex: 1;
  margin-top: 2px;
}

.title{
  user-select:none; 
}

input[disabled] {
  background-color: #f3eeee; 
  color: #706767; 
  cursor: not-allowed;
}
input:disabled{  
  color: #706767;
  opacity: 1;
  -webkit-text-fill-color: #706767;
}


/* table相关样式*/
.table-header{
  box-sizing: border-box;
  margin-top: 5px;
  font-size: 14px;
  font-weight: bold;
  /* 添加flex布局 */
  display: flex;
  width: 100%;
}
.table-header :first-child{
  border-left: 1px solid #ccc; 
}
.table-header div{
  user-select:none; 
  float: left;
  text-align: center;
  border: 1px solid #ccc;
  border-left: none;
  padding: 0px;
  height: 35px;
  background-color: #f6f6f6;
  box-sizing: border-box;

  /* 添加flex布局，设置为垂直居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.table-body{
  box-sizing: border-box;
  float: left;
  width: 100%;

  /* 添加flex布局 */
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: auto;
}
.table-line{
  font-size: 13px;
  float: left;
  box-sizing: border-box;

  /* 添加flex布局 */
  display: flex;
  width: 100%;
}
.table-line div{
  float: left;
  border-right: 1px solid #ccc; 
  border-bottom: 1px solid #ccc;
  padding: 3px;
  padding-right: 4px;
  padding-left: 4px;
  height: 45px;
  overflow: anto;
  box-sizing: border-box;
  word-wrap:break-word;
  word-break:break-word;

  /* 添加flex布局，设置为垂直居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mini-line div{
  overflow: hidden;
  height: 40px;
}

.table-line span{
  max-height: 40px;
  border: none!important;;
}

.table-line :first-child{
  border-left: 1px solid #ccc; 
}

.table-line:hover div{
  background-color: #edf7fd!important
}

.table-line-current div{
  background-color: #edf7fd!important
}

.table-body .table-line:nth-child(2n) div{
  background-color: #f7f7f7;
}
.table-body .table-line:nth-child(2n+1) div{
  background-color: #fff;
}
.table-pager{
  width: 100%;
  margin: 2px 2px;
  float: left;
}

.table-pager .desbox{
  float: left;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
}
.table-pager .buttonbox{
  float: right;
}

.table-pager .buttonbox button{
  font-size: 13px;
  min-width: 25px;
  margin-left: 4px;
  text-align: center;
  padding: 0 5px;
  border: 1px solid rgb(84, 139, 221); 
  color: #3d9be7;
}

.table-pager .buttonbox button[disabled]{
  border: 1px solid #aaa2a2; 
  color: #888c8f;
}


/* 弹框样式 */
.van-overlay {
    background-color: rgba(0, 0, 0, .4)!important;
}
.van-popup {
  overflow-y: visible !important;
}
.popup-info-header{
  text-align: center;
  color: rgb(10, 114, 161);
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  border-bottom: 1px solid #e2e2e2; 
  margin-bottom: 10px;
}
.popup-info-footer{
  height: 50px;
  text-align: center;
  border-top: 1px solid #e2e2e2; 
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
.popup-info-footer button{
  margin: 8px 10px;
  width: 80px;
}
.popup-row-info{
  padding: 0 15px;
}
.popup-row-info .box{
  height: 42px;
}
.popup-row-info .box .title{
  width:100px;
  text-align: right;
}

</style>
