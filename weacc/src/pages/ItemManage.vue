<template>
  <div class="root">
    <div class="box"> 
        <div class="title">会计期间：</div>
        <my-select class="my-select" v-model="current_period" :options="period_list" valueField="period_id" displayField="period_name"/>
    </div>
    <div class="box"> 
        <div class="title">凭证描述：</div>
        <input type="text" v-model="description" @keyup.enter="query"/>
    </div>
    <div class="box"> 
        <button class="bule-button" @click="query">查 询</button>
        <button class="litter-bule-button" @click="go('itemDetailAdd')" >凭证登记(简)</button>
        <button class="yellow-button" @click="go('itemDetailSave')">凭证登记</button>
    </div>
    <div class="data-table-box" :style="'width:'+width+'px; height: 270px;'">
        <table class="data-table" :style="'width:'+width+'px;'">
            <thead>
                <tr>
                    <th style="width: 20%;">凭证号</th>
                    <th style="width: 25%;">费用日期</th>
                    <th style="width: 55%;">凭证描述</th>
                </tr>
            </thead>
        </table>
        <div class="data-table-content" :style="'width:'+width+'px; height: 230px;'">
            <table class="data-table" :style="'width:'+width+'px;'">
                <tbody>
                    <tr :data-itemid="item.item_id" @click="showDetail(item.item_id,index)" v-for="(item, index) in item_list" :key="item.item_id" :class="(current_line==index?'data-table-current-line':'')">
                        <td style="width: 20%; color: #0f4ea0; text-align: center; cursor: pointer;" @click.stop="goToDetail(item.item_id)">{{item.item_num}}</td>
                        <td style="width: 25%; text-align: center;">{{item.exp_time}}</td>
                        <td style="width: 55%; overflow-x: hidden;">{{item.description}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <div class="table-pager">
        <div class="desbox">显示 {{(currentPage-1)*limit+1}} 到 {{currentPage*limit > totalCounts?totalCounts:currentPage*limit}} 条，共 {{totalCounts}} 条，共 {{totalPages}} 页</div>
        <div class="buttonbox"> 
        <button @click="changePage(1)" :disabled="currentPage==1" >{{"<<"}}</button>
        <button @click="changePage(2)" :disabled="currentPage==1" >{{"<"}}</button>
        <button >{{currentPage}} / {{totalPages}}</button>
        <button @click="changePage(3)" :disabled="currentPage * limit >= totalCounts" > {{">"}}</button>
        <button @click="changePage(4)" :disabled="currentPage * limit >= totalCounts" > {{">>"}}</button>
        </div>
    </div>

    <div class="data-table-box" :style="'width:'+width+'px; height: 165px;'">
        <table class="data-table" :style="'width:'+width+'px;'">
            <thead>
                <tr>
                    <th style="width: 25%;">科目名称</th>
                    <th style="width: 20%;">借</th>
                    <th style="width: 20%;">贷</th>
                    <th style="width: 35%;">行描述</th>
                </tr>
            </thead>
        </table>
        <div class="data-table-content" :style="'width:'+width+'px; height: 120px;'">
            <table class="data-table" :style="'width:'+width+'px;'">
                <tbody>
                    <tr v-for="item in item_line_list" :key="item.item_line_id">
                        <td style="width: 25%;">{{item.account_name}}</td>
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
import { Toast } from 'vant';

export default {
    data(){
        return {
            item_list:[],
            item_line_list:[],
            period_list:[],
            limit : 5,
            totalCounts: 0,
            totalPages: 0,
            currentPage: 1,
            period_id: null,
            description: '',
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
        go(url){
            this.$router.push({ path: url });
        },
        query(){
            if(this.period_list.length == 0){
                Toast.fail('当前没有打开的期间')
                return;
            }
            let url = 'exp/item.query';
            let data = {
                period_id: this.current_period.period_id,
                limit : this.limit,
                description : this.description,
                start : (this.currentPage - 1) * this.limit
            };
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    this.item_list = res.data.datas;
                    this.item_line_list = [];
                    this.current_line = -1;
                    this.totalCounts = res.data.totalCounts;
                    this.totalPages = Math.ceil(res.data.totalCounts/this.limit);
                    this.checkPage();
                }
            });
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
        },
        showDetail(item_id, index){
            this.current_line = index;
            let url = 'exp/itemLine.query';
            let data = {
                item_id: item_id,
                order : "asc"
            };
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.item_line_list=res.data.datas;
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
        async getPeriodList(){
            return new Promise((resolve,reject)=>{
                let url = 'fnd/expPeriod.query!combo';
                let data ={};
                request.post(url, data).then(res => {
                    if(res.data.success){
                        this.period_list = res.data.datas;
                        this.current_period = res.data.datas[0];
                        resolve(1);
                    }else{
                        resolve(0);
                    }
                });
            });
        },
        goToDetail(item_id){
            this.go("/itemDetailSave?item_id="+item_id)
        },
        async init(isAdd){
            let result = await this.getPeriodList();
            if(result == 1){
                if(isAdd==1 && this.totalCounts != 0){
                    this.currentPage = this.totalPages;
                    if(this.item_list.length == this.limit){
                        this.currentPage = this.currentPage + 1;
                    }
                }
                this.query();
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            let isAdd = to.query.isAdd;
            vm.init(isAdd);
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