<template>
<div class="root">
  <div class="box"> 
    <div class="title">会计期间：</div>
    <my-select class="my-select" v-model="current_period" @select="query" :options="period_list" valueField="period_id" displayField="period_name"/>
  </div>
  <div class="box"> 
    <button class="bule-button" @click="initByLastMonth">按上月开销导入</button>
  </div>
  <div class="box"> 
    <div class="table-header">
      <div style="width: 190px;">科目名称</div>
      <div style="flex:1">本月预算</div>
      <div style="flex:1">操作</div>
    </div>
    <div class="table-body"  style="height:240px;">
      <div @click="showDetail(item.account_id,index)" :class="current_line==index?'table-line mini-line table-line-current':'table-line mini-line'" v-for="(item, index) in item_list" :key="item.account_id">
        <div style="width: 190px;">{{item.account_name}}</div>
        <div style="flex:1;text-align: right;">{{item.append_amount | currency}}</div>
        <div @click="showBox(item)" style="flex:1; text-align: center; color: #0f4ea0;">{{item.account_id?'调整预算':''}}</div>
      </div>
    </div>
  </div>

  <div class="box"> 
    <div class="table-header">
      <div style="width: 100px;">添加时间</div>
      <div style="width: 80px;">预算金额</div>
      <div style="flex:1">说明</div>
    </div>
    <div class="table-body" style="max-height: 225px;min-height: 90px;">
      <div class="table-line" v-for="(item,index) in item_line_list" :key="index">
        <div style="width: 100px; text-align: center; ">{{item.add_time}}</div>
        <div style="width: 80px; text-align: right;">{{item.amount |currency }}</div>
        <div style="flex:1">{{item.description}}</div>
      </div>
    </div>
  </div>
  <van-popup v-model="showUpdateBox" style="max-width:460px;width:90%;top:43%">
    <div class="popup-info-header">预算调整</div>
        <div class="popup-row-info">
          <div class="box"> 
            <div class="title">科目名称：</div>
            <input type="text" disabled="true" style="background-color: #f1f1f1;" :value="account_name" />
          </div>
          <div class="box"> 
            <div class="title">调整方式：</div>
            <van-radio-group v-model="change_type" direction="horizontal">
              <van-radio style="margin:3px;" :name="1" icon-size="14" >增加</van-radio>
              <van-radio style="margin:3px;" :name="-1" icon-size="14" >缩减</van-radio>
            </van-radio-group>
          </div>
          <div class="box"> 
            <div class="title">预算金额：</div>
            <input type="digit" v-model="amount" />
          </div>
          <div class="box"> 
            <div class="title">调整说明：</div>
            <textarea v-model="description"/>
          </div>
        </div>
        <div class="popup-info-footer">
            <button class="litter-bule-button" @click="hiddenBox">取 消</button>
            <button class="bule-button" @click="saveChange">保 存</button>
        </div>
  </van-popup>
</div>
</template>

<script>
import request from '@/util/request';
import { Toast,Dialog } from 'vant';
export default {

    data(){
      return {
        item_list:[],
        item_line_list:[],
        period_list:[],
        current_period: {},
        showIndex: 0,
        account_id:"",
        account_name:"",
        description:"",
        amount:"",
        change_type:1,
        showUpdateBox: false,
        current_line:-1
      }
    },
    methods:{
      hiddenBox(){
          this.showUpdateBox= false;
      },
      showBox(item){
          this.showUpdateBox = true;
          this.account_id = item.account_id;
          this.account_name = item.account_name;
          this.amount = "";
          this.description = "";
      },
      initByLastMonth(){
        if(this.period_list.length == 0){
          Toast.fail('当前没有打开过的期间');
          return;
        }
        Dialog.confirm({
          title: '提示',
          message: '导入之前会删除当前期间已有的预算数据，确定要导入吗？',
          confirmButtonColor : "#2d6ca2"
        }).then(() => {
          let url = "exp/amountManager.execute!initByLastMonth";
          let data = {
            period_id: this.current_period.period_id
          };
          request.post(url,data,{showLoadding:true}).then(res => {
            if(res.data.success){
              Dialog.alert({
                title: '提示',
                confirmButtonColor : "#2d6ca2",
                message: "导入成功",
              }).then(() => {
                  this.query();
              });
            }else{
                Toast.fail(res.data.message);
            }
          });
        }).catch(() => {
        });
      },
      saveChange(){
        if(!(this.amount)){
          Toast.fail("金额不能为空！");
          return;
        }
        if(!(this.description)){
          Toast.fail("调整说明不能为空！");
          return;
        }
        let url = 'exp/amountManager.execute!add';
        let data = {
          period_id: this.current_period.period_id,
          account_id: this.account_id,
          amount: this.amount * this.change_type,
          description: this.description
        };
        request.post(url,data,{showLoadding:true}).then(res => {
          if(res.data.success){
            Dialog.alert({
              title: '提示',
              confirmButtonColor : "#2d6ca2",
              message: "调整成功",
            }).then(() => {
              this.hiddenBox();
              this.query();
            });
          }else{
            Toast.fail(res.data.message);
          }
        });
      },
      query(){
        if(this.period_list.length == 0){
          Toast.fail('当前没有打开过的期间');
          return;
        }
        let url = 'exp/amountManager.query';
        let data = {
          period_id: this.current_period.period_id
        };
        request.post(url,data,{showLoadding:true}).then(res => {
          if(res.data.success){
            let json={account_name:'合计'};
            let append_amount = 0;
            for(let i=0;i<res.data.datas.length;i++){
              append_amount = this.add(append_amount, res.data.datas[i].append_amount);
            }
            json.append_amount = append_amount;
            res.data.datas.push(json);

            this.item_list = res.data.datas;
            this.current_line = -1;
            this.item_line_list = [];
          }else{
            Toast.fail(res.data.message)
          }
        });
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
      showDetail(account_id, index){
        let url = 'exp/amountManager.query!detail';
        let data = {
          account_id: account_id,
          period_id: this.current_period.period_id
        };
        request.post(url,data).then(res => {
          if(res.data.success){
            this.current_line = index;
            this.item_line_list = res.data.datas;
          }else {
            Toast.fail(res.data.message);
          }
        });
      },
      getPeriodList(){
        let url = 'fnd/expPeriod.query!combo';
        request.post(url).then(res => {
          if(res.data.success){
            this.period_list = res.data.datas;
            this.current_period = res.data.datas[res.data.datas.length-1];
            this.query();
          }else{
            Toast.fail(res.data.message);
          }
        })
      },
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
          vm.getPeriodList();
      });
    }
  }
</script>

<style scoped>
.title{
  width: 80px;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  float: left;
  text-align: right;
}
input{
  flex: 1;
  margin-top: 2px;
  float: left;
}
textarea{
  flex: 1;
  margin-top: 2px;
}
</style>