<template>
<div class="root">
  <div class="box"> 
    <div class="title">会计期间：</div>
    <my-select class="my-select" :value="current_period" @select="setPeriod" :options="period_list" valueField="period_id" displayField="period_name"/>
  </div>

  <div class="data-table-box" :style="'width:'+width+'px; height: 306px;'">
    <table class="data-table" :style="'width:'+width+'px;'">
      <thead>
        <tr>
          <th style="width: 28%;">科目名称</th>
          <th style="width: 24%;">本月预算</th>
          <th style="width: 24%;">本月发生</th>
          <th style="width: 24%;">预算余额</th>
        </tr>
      </thead>
    </table>
    <div class="data-table-content" :style="'width:'+width+'px; height: 280px;'">
      <table class="data-table" :style="'width:'+width+'px;'">
        <tbody>
          <tr @click="showDetail(item.account_id,index)" v-for="(item,index) in item_list" :key="index" :class="(current_line==index?'data-table-current-line':'')">
            <td style="width: 28%; text-align: center;">{{item.account_name}}</td>
            <td class="num-font" style="width: 24%; text-align: right;">{{item.append_amount | currency}}</td>
            <td class="num-font" style="width: 24%; text-align: right;">{{item.emerge_amount | currency}}</td>
            <td class="num-font" :style="'width: 24%; text-align: right; color:' + (item.end_amount < 0?'red':'green')">{{item.end_amount | currency}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="data-table-box" :style="'width:'+width+'px; height: 306px;'">
    <table class="data-table" :style="'width:'+width+'px;'">
      <thead>
        <tr>
          <th style="width: 25%;">费用日期</th>
          <th style="width: 20%;">借</th>
          <th style="width: 20%;">贷</th>
          <th style="width: 35%;">凭证描述</th>
        </tr>
      </thead>
    </table>
    <div class="data-table-content" :style="'width:'+width+'px; height: 280px;'">
      <table class="data-table" :style="'width:'+width+'px;'">
        <tbody>
          <tr v-for="item in item_line_list" :key="item.item_line_id">
            <td style="width: 25%; text-align: center;">{{item.exp_time}}</td>
            <td class="num-font" style="width: 20%; text-align: right;">{{item.dr_amount | currency}}</td>
            <td class="num-font" style="width: 20%; text-align: right;">{{item.cr_amount | currency}}</td>
            <td style="width: 35%;">{{item.description}}</td>
          </tr>
        </tbody>
      </table>
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
    computed:{
        width(){
            let width = document.documentElement.clientWidth;
            if(width > 600){
                width = 600;
            }
            return width-20;
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
            this.current_line = index;
            let url ='exp/amountManager.query!getExpDetail';
            let data = {
                account_id: account_id,
                period_id: this.current_period.period_id,
                order : "asc"
            };
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.item_line_list = res.data.datas;
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