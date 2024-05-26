<template>
<div class="root">
  <div class="box"> 
    <div class="title">会计期间：</div>
    <my-select class="my-select" :value="current_period" @select="setPeriod" :options="period_list" valueField="period_id" displayField="period_name"/>
  </div>

  <div class="box"> 
    <div class="table-header">
      <div style="width: 120px;">科目名称</div>
      <div style="flex:1">本月预算</div>
      <div style="flex:1">本月发生</div>
      <div style="flex:1">预算余额</div>
    </div>
    <div class="table-body"  style="height: 280px;">
      <div @click="showDetail(item.account_id,index)" :class="'table-line mini-line ' + (current_line==index?'table-line-current':'')" v-for="(item,index) in item_list" :key="index">
        <div style="width: 120px;">{{item.account_name}}</div>
        <div class="num-font" style="flex:1;text-align: right;">{{item.append_amount | currency}}</div>
        <div class="num-font" style="flex:1;text-align: right;">{{item.emerge_amount | currency}}</div>
        <div class="num-font" :style="'flex:1;text-align: right; color:' + (item.end_amount &lt; 0?'red':'green')">{{item.end_amount | currency}}</div>
      </div>
    </div>
  </div>

  <div class="box"> 
    <div class="table-header">
      <div style="width: 90px;">费用日期</div>
      <div style="width: 75px;">借</div>
      <div style="width: 75px;">贷</div>
      <div style="flex:1;">凭证描述</div>
    </div>
    <div class="table-body" style="max-height:225px; min-height:90px;">
      <div class="table-line" hover-class="table-line-hover" v-for="item in item_line_list" :key="item.item_line_id">
        <div style="width: 90px;text-align: center;">{{item.exp_time}}</div>
        <div class="num-font" style="width: 75px;text-align: right;">{{item.dr_amount | currency}}</div>
        <div class="num-font" style="width: 75px;text-align: right;">{{item.cr_amount | currency}}</div>
        <div style="flex: 1;"><span>{{item.description}}</span></div>
      </div>
    </div>
  </div> 
</div>
</template>

<script>
import request from '@/util/request';
export default {
    data(){
        return {
            item_list:[],
            item_line_list:[],
            period_list:[],
            current_period: {},
            current_line:-1
        }
    },
    methods:{
        getPeriodList(){
            let url = 'fnd/expPeriod.query!comboAll';
            let data ={};
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.period_list = res.data.datas;
                    this.current_period = res.data.datas[res.data.datas.length-1];
                    this.query();
                }
            });
        },

        query(){
            let url = 'exp/amountManager.query';
            let data = {
                period_id: this.current_period.period_id
            };
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    let json={account_name:'合计'};
                    let append_amount = 0;
                    let emerge_amount = 0;
                    let end_amount = 0;
                    for(let i=0;i<res.data.datas.length;i++){
                        append_amount = this.add(append_amount, res.data.datas[i].append_amount);
                        emerge_amount = this.add(emerge_amount, res.data.datas[i].emerge_amount);
                        end_amount = this.add(end_amount, res.data.datas[i].end_amount);
                    }
                    json.append_amount = append_amount;
                    json.emerge_amount = emerge_amount;
                    json.end_amount = end_amount;
                    res.data.datas.push(json);
                    this.item_list = res.data.datas;
                    this.current_line = -1;
                    this.item_line_list=[];
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
            let url ='exp/amountManager.query!getExpDetail';
            let data = {
                account_id: account_id,
                period_id: this.current_period.period_id,
                order : "asc"
            };
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.item_line_list = res.data.datas;
                    this.current_line = index;
                }
            });
        },
        setPeriod(item){
            this.current_period = item;
            this.query();
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
</style>