<template>
  <div class="root">
    <div class="box"> 
        <div class="title">会计期间：</div>
        <my-select class="my-select" :value="current_period" @select="setPeriodId" :options="period_list" valueField="period_id" displayField="period_name"/>
    </div>
    <div class="box"> 
        <div class="title">凭证描述：</div>
        <input type="text" v-model="description"/>
    </div>
    <div class="box"> 
        <button class="bule-button" @click="query">查 询</button>
        <button class="litter-bule-button" @click="go('itemDetailAdd')" >凭证登记(简)</button>
        <button class="yellow-button" @click="go('itemDetailSave')">凭证登记</button>
    </div>
    <div class="box"> 
        <div class="table-header">
        <div style="width: 80px;">凭证号</div>
        <div style="width: 100px;">费用日期</div>
        <div style="flex: 1;">凭证描述</div>
        </div>
        <div class="table-body" style="min-height: 230px;">
        <div :data-itemid="item.item_id" @click="showDetail(item.item_id,index)" :class="current_line==index?'table-line table-line-current':'table-line'" v-for="(item, index) in item_list" :key="item.item_id">
            <div style="width: 80px;color: #0f4ea0; text-align: center;" @click="goToDetail(item.item_id)">{{item.item_num}}</div>
            <div style="width: 100px; text-align: center;">{{item.exp_time}}</div>
            <div style="flex:1; overflow-x: hidden;"><span>{{item.description}}</span></div>
        </div>
        </div>
    </div>
    
    <div class="table-pager">
        <div class="desbox">显示 {{(currentPage-1)*limit+1}} 到 {{currentPage*limit > totalCounts?totalCounts:currentPage*limit}} 条，共 {{totalCounts}} 条，共 {{totalPages}} 页</div>
        <div class="buttonbox"> 
        <button @click="changePage(1)" :disabled="currentPage==1" >{{"<<"}}</button>
        <button @click="changePage(2)" :disabled="currentPage==1" >{{"<"}}</button>
        <button >{{currentPage}} / {{totalPages}}</button>
        <button @click="changePage(3)" :disabled="currentPage * limit &gt;= totalCounts" > {{">"}}</button>
        <button @click="changePage(4)" :disabled="currentPage * limit &gt;= totalCounts" > {{">>"}}</button>
        </div>
    </div>

    <div class="box"> 
        <div class="table-header">
            <div style="width: 100px;">科目名称</div>
            <div style="width: 75px;">借</div>
            <div style="width: 75px;">贷</div>
            <div style="flex: 1;">行描述</div>
        </div>
        <div class="table-body" style="min-height: 90px;">
            <div class="table-line" hover-class="table-line-hover" v-for="item in item_line_list" :key="item.item_line_id">
                <div style="width: 100px;">{{item.account_name}}</div>
                <div style="width: 75px;text-align: right;">{{item.dr_amount}}</div>
                <div style="width: 75px;text-align: right;">{{item.cr_amount}}</div>
                <div style="flex: 1;"><text user-select="true">{{item.description==null?"":item.description}}</text></div>
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
    methods:{
        go(url){
            this.$router.push({ path: url });
        },
        query(){
            if(this.period_list.length == 0){
                alert('当前没有打开的期间')
                return;
            }
            let url = 'exp/item.query';
            let data = {
                period_id: this.current_period.period_id,
                limit : this.limit,
                description : this.description,
                start : (this.currentPage - 1) * this.limit
            };
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.item_list = res.data.datas;
                    this.item_line_list = [];
                    this.current_line = -1;
                    this.totalCounts = res.data.totalCounts;
                    this.totalPages = Math.ceil(res.data.totalCounts/this.limit);
                    this.checkPage();
                }else if(res.data.timeout){
                    this.$router.push("/login");
                }
            });
        },
        checkPage(){
            if(this.currentPage > 1 &&this.currentPage > this.totalPages){
                if(this.data.totalPages < 2){
                    this.currentPage=1;
                }else{
                    this.currentPage=this.data.totalPages;
                }
                this.query();
            }
        },
        showDetail(item_id, index){
            let url = 'exp/itemLine.query';
            let data = {
                item_id: item_id,
                order : "asc"
            };
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.item_line_list=res.data.datas;
                    this.current_line = index;
                }else if(res.data.timeout){
                    this.$router.push("/login");
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
                        if(res.data.timeout){
                            this.$router.push("/login");
                        }
                        resolve(0);
                    }
                });
            });
        },
        goToDetail(){

        },
        setPeriodId(item){
            this.current_period = item;
        },
        async init(){
            let result = await this.getPeriodList();
            if(result == 1){
                this.query();
            }
        }
    },
    mounted(){
        this.init();
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