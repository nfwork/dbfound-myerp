<template>
  <div class="root">
  <div class="box"> 
    <div class="title">本期从：</div>
    <my-select class="my-select" :value="current_period_from" @select="setPeriodFrom" :options="period_list" valueField="period_id" displayField="period_name"/>
    <div class="title" style="width: 45px;">到：</div>
    <my-select class="my-select" :value="current_period_to" @select="setPeriodTo" :options="period_list" valueField="period_id" displayField="period_name"/>
  </div>
  <div class="box"> 
    <div class="title">科目类型：</div>
    <my-select class="my-select" :value="account_type" @select="setAccountType" :options="account_type_list" valueField="code_value" displayField="code_name"/>
  </div>
  <div class="box"> 
    <button class="bule-button" @click="queryMain" >查 询</button>
    <button class="yellow-button" @click="reset">重 置</button>
  </div>
  <div class="box"> 
    <div class="table-header">
      <div style="flex: 1;">科目名称</div>
      <div style="flex: 1;">期初余额</div>
      <div style="width: 80px;">本期增加</div>
      <div style="flex: 1;">期末余额</div>
    </div>
    <div class="table-body" style="max-height: 240px;">
      <div @click="showDetail(item.account_id,index)" :class="'table-line mini-line ' + (current_line==index?'table-line-current':'')" v-for="(item,index) in item_list" :key="index">
        <div style="flex: 1; ;text-align: center;">{{item.account_name}}</div>
        <div style="flex: 1;text-align: right;">{{item.remaind_amount | currency}}</div>
        <div style="width: 80px;text-align: right;">{{item.emerge_amount | currency}}</div>
        <div style="flex: 1;text-align: right;">{{item.end_amount | currency}}</div>
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
    <div class="table-body" style="max-height: 230px;">
      <div class="table-line" hover-class="table-line-hover" v-for="(item) in item_line_list" :key="item.item_line_id">
        <div style="width: 90px;text-align: center;">{{item.exp_time}}</div>
        <div style="width: 75px;text-align: right;">{{item.dr_amount | currency}}</div>
        <div style="width: 75px;text-align: right;">{{item.cr_amount | currency}}</div>
        <div style="flex: 1;"><span>{{item.description}}</span></div>
      </div>
    </div>
  </div>

    <div class="table-pager" style="margin-top:6px">
        <div class="desbox">显示 {{(currentPage-1)*limit+1}} 到 {{currentPage*limit > totalCounts?totalCounts:currentPage*limit}} 条，共 {{totalCounts}} 条，共 {{totalPages}} 页</div>
        <div class="buttonbox"> 
        <button @click="changePage(1)" :disabled="currentPage==1" >{{"<<"}}</button>
        <button @click="changePage(2)" :disabled="currentPage==1" >{{"<"}}</button>
        <button >{{currentPage}} / {{totalPages}}</button>
        <button @click="changePage(3)" :disabled="currentPage * limit &gt;= totalCounts" > {{">"}}</button>
        <button @click="changePage(4)" :disabled="currentPage * limit &gt;= totalCounts" > {{">>"}}</button>
        </div>
    </div>
</div>
</template>

<script>
import request from '@/util/request';
import { Toast } from 'vant';
export default {
    data(){
        return {
            item_list:[{},{},{},{}],
            item_line_list:[],
            period_list:[],
            account_type_list:[],
            current_period_from: {},
            current_period_to: {},
            current_account:{},
            limit : 5,
            totalCounts: 0,
            totalPages: 0,
            currentPage: 1,
            account_id:"",
            account_type:{},
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
                    this.current_period_from = res.data.datas[res.data.datas.length-1];
                    this.current_period_to = res.data.datas[res.data.datas.length-1];
                    this.queryMain();
                }
            });
        },
        getAccountTypeList(){
            let url = 'fnd/sourceCode.query';
            let data ={};
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.account_type_list = res.data.datas;
                }
            });
        },
        queryMain(){
            if(this.period_list.length == 0){
                Toast.fail('当前没有打开过的期间')
                return;
            }
            let url= 'report/accountAmountQuery.query';
            let data = {
                period_code_from: this.current_period_from.period_code,
                period_code_to: this.current_period_to.period_code,
                account_type: this.account_type.code_value
            };
            request.post(url, data,{showLoadding:true}).then(res => {
                if(res.data.success){
                    let json={account_name:'合计'};
                    let remaind_amount = 0;
                    let emerge_amount = 0;
                    let end_amount = 0;
                    for(let i=0;i<res.data.datas.length;i++){
                        remaind_amount = this.add(remaind_amount, res.data.datas[i].remaind_amount);
                        emerge_amount = this.add(emerge_amount, res.data.datas[i].emerge_amount);
                        end_amount = this.add(end_amount, res.data.datas[i].end_amount);
                    }
                    json.remaind_amount = remaind_amount;
                    json.emerge_amount = emerge_amount;
                    json.end_amount = end_amount;
                    res.data.datas.push(json);
                    this.item_list=res.data.datas;
                    this.current_line=-1;
                    this.item_line_list=[];
                }
            });
        },
        setAccountType(item){
            this.account_type = item;
        },
        setPeriodFrom(item){
            this.current_period_from = item;
        },
        setPeriodTo(item){
            this.current_period_to = item;
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
        reset(){
            this.account_type = {};
            this.current_period_from = this.period_list[this.period_list.length-1];
            this.current_period_to = this.period_list[this.period_list.length-1];
        },
        showDetail(account_id,index){
            this.account_id = account_id;
            this.current_line = index;
            this.currentPage = 1;
            this.query();
        },
        query(){
            let url ='report/accountAmountQuery.query!getExpDetail';
            let data = {
                account_id: this.account_id,
                limit: this.limit,
                start : (this.currentPage - 1) * this.limit,
                period_code_from: this.current_period_from.period_code,
                period_code_to: this.current_period_to.period_code,
                order : "asc"
            };
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.item_line_list = res.data.datas;
                    this.totalCounts = res.data.totalCounts;
                    this.totalPages = Math.ceil(res.data.totalCounts/this.limit);
                    this.checkPage();
                }
            });
        },
        changePage(type){
            if(type==1){
                if(this.currentPage > 1){
                    this.currentPage=1;
                    this.query();
                }
            }else if(type==2){
                if(this.currentPage > 1){
                    this.currentPage = this.currentPage-1
                    this.query();
                }
            }else if(type==3){
                if(this.currentPage * this.limit < this.totalCounts){
                    this.currentPage = this.currentPage+1;
                    this.query();
                }
            }else if(type==4){
                if(this.currentPage * this.limit < this.totalCounts){
                    this.currentPage = Math.ceil(this.totalCounts/this.limit);
                    this.query();
                }
            }
        },
        checkPage(){
            if(this.currentPage > 1 &&this.currentPage > this.totalPages){
                if(this.totalPages < 2){
                    this.currentPage=1;
                }else{
                    this.currentPage=this.totalPages;
                }
                this.query();
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getPeriodList();
            vm.getAccountTypeList();
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