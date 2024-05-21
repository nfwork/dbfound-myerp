<template>
    <div class="home">
        <div class="menu-title">Hi {{user_name}}</div>
        <div class="summary">
            <div class="summary-item">本月总开支：<div class="money-big">￥{{totalexp}}</div></div>
            <div v-for="(item,index) in accounts_exp" :key="index" class="summary-item">{{item.account_name}}：<div class="money-small">￥{{item.totalexp}}</div></div>
        </div>
        <div class="menu-title">记账</div>
        <div class="function">
            <div @click="go('/itemManage')" class="function-item" hover-class="function-item-hover"><img src="images/pzgl.jpg">凭证管理</div>
            <div @click="go('/itemDetailAdd')" class="function-item" hover-class="function-item-hover"><img src="images/pzdjj.jpg">凭证登记(简)</div>
            <div bindtap="menuTap" class="function-item" hover-class="function-item-hover"><img src="images/pzdj.jpg">凭证登记</div>
        </div>

        <div class="menu-title">统计查询</div>
        <div class="function">
            <div @click="go('/itemQuery')" class="function-item" hover-class="function-item-hover"><img src="images/pzcx.jpg">凭证查询</div>
            <div bindtap="menuTap" :fid="5" class="function-item" hover-class="function-item-hover"><img src="images/fymx.jpg">费用明细</div>
            <div bindtap="menuTap" :fid="6" class="function-item" hover-class="function-item-hover"><img src="images/kmye.jpg">科目余额</div>
            <div bindtap="menuTap" :fid="7" class="function-item" hover-class="function-item-hover"><img src="images/kxhz.jpg">开销汇总</div>
        </div>

        <div class="menu-title">基础设置</div>
        <div class="function">
            <div bindtap="menuTap" :fid="8" class="function-item" hover-class="function-item-hover"><img src="images/qjgl.jpg">期间设置</div>
            <div bindtap="menuTap" :fid="9" class="function-item" hover-class="function-item-hover"><img src="images/kmsz.jpg">科目设置</div>
            <div bindtap="menuTap" :fid="10" class="function-item" hover-class="function-item-hover"><img src="images/yssz.jpg">预算设置</div>
        </div>

        <div class="menu-title">使用说明</div>
        <div class="explain">
            <div>1、创建科目并分配好类别，如费用类(日常开支、水电燃气)、存款类(我的银行存款)、收益类(工资收入)等；</div>
            <div>2、打开会计期间，只有处于打开状态的期间才能记账，本月结束后，关闭期间进行关账；可二次打卡；</div>
            <div>3、打开记账功能进行凭证登记，一借一贷，如借日常费用、贷银行存款；也可使用凭证登记(简)进行快速登记；</div>
        </div>
    </div>
</template>

<script>
    import request from '@/util/request';
    export default {
      data(){
          return {
              user_name:"",
              totalexp:0,
              accounts_exp:[]
          }
      },
      methods:{
          go(url){
            this.$router.push({ path: url });
          }
      },
      mounted(){
        let url = 'report/homeAnalysis.query?a=1';
        let data = {};
        request.post(url, data).then(res => {
            if(res.data.success){
                let totalAccount = res.data.datas.shift();
                this.user_name = res.data.outParam.user_name;
                this.accounts_exp = res.data.datas,
                this.totalexp = totalAccount.totalexp;
            }else if(res.data.timeout){
                this.$router.push("/login");
            }
        });
      }
    }
</script>

<style scoped>

.home{
  width: 100%;
}

.menu-title{
  box-sizing: border-box;
  margin: 10px 0;
  font-size: 13px;
  color: gray;
  padding: 6px;
  border-bottom: 1px solid rgb(233, 228, 228);
}

.summary{
  box-sizing: border-box;
  margin: 10px 5px;
  margin-bottom: 10px;
  min-height: 80px;
  font-size: 13px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.summary :first-child{
  margin-top: 0px;
  width: 100%;
}
.summary-item{
  width: 170px;
  margin-top: 10px;
  margin-left: 10px;
}

.money-big{
  font-size: 16px;
  display: inline;
  color: red;
}

.money-small{
  display: inline;
  font-size: 14px;
  color: red;
}

.function{
  box-sizing: border-box;
  font-size: 13px;
  display: flex;
}

.function-item{
  height: 90px;
  width: 90px;
  text-align: center;
  float: left;
  padding-top: 10px;
}

.function-item:hover{
  background-color: #efefef;
}

.function-item img{
  width: 40px;
  height: 40px;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
}

.explain{
  font-size: 12px;
  color: gray;
  padding-bottom: 6px;
}
.explain view{
  padding: 2px;
}
</style>