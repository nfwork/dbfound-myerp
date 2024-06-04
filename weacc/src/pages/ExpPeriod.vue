<template>
  <div class="root">
    <div class="box"> 
        <div class="title">期间编号：</div>
        <input type="text" v-model="period_code"/>
    </div>
    <div class="box"> 
        <button class="bule-button" @click="query">查 询</button>
        <button class="yellow-button" @click="reset">重 置</button>
    </div>
    <div class="box"> 
        <div class="table-header">
        <div style="flex: 3;">期间编号</div>
        <div style="flex: 3;">期间名称</div>
        <div style="flex: 2;">期间状态</div>
        <div style="flex: 2;">操作</div>
        </div>
        <div class="table-body" style="min-height: 400px;">
        <div class="table-line mini-line" v-for="item in item_list" :key="item.period_id">
            <div style="flex: 3; text-align: center;">{{item.period_code}}</div>
            <div style="flex: 3; text-align: center;">{{item.period_name}}</div>
            <div :style="'flex: 2; text-align: center; color:'+(item.status=='N'?'red':item.status=='Y'?'green':'black')">{{item.status=='A'?'未打开':item.status=='Y'?'已打开':'已关闭'}}</div>
            <div @click="changeStatus(item.period_id,item.status)" style="flex: 2; text-align: center; color: #0f4ea0;">{{item.status=='Y'?'关闭':'打开'}}</div>
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
</div>

</template>

<script>
import { Toast, Dialog } from 'vant';
import request from '@/util/request';
export default {
    data(){
        return {
            item_list:[],
            period_code:'',
            limit : 10,
            totalCounts: 0,
            totalPages: 0,
            currentPage: 1
        }
    },
    methods:{
        reset(){
            this.period_code='';
        },
        changeStatus(period_id,status){
            let url = 'fnd/expPeriod.execute!' + (status=='Y'?'close':'open');
            status = status=='Y'?'N':'Y';
            let data = {status,period_id}
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    let title = status=='Y'?"期间打开成功":'期间关闭成功';
                    Dialog.alert({
                        title: '提示',
                        confirmButtonColor : "#2d6ca2",
                        message: title,
                    }).then(() => {
                        this.query();
                    });
                }else{
                     Toast.fail(res.data.message);
                }
            });
        },

        query(){
            let url = 'fnd/expPeriod.query';
            let data = {
                limit : this.limit,
                start : (this.currentPage - 1) * this.limit,
                period_code: this.period_code
            };
            request.post(url, data,{showLoadding:true}).then(res => {
                if(res.data.success){
                    this.item_list = res.data.datas;
                    this.item_line_list =[];
                    this.totalCounts=res.data.totalCounts;
                    this.totalPages=Math.ceil(this.totalCounts/this.limit)
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
            vm.query();
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
.table-pager{
    margin-top: 5px;
}
</style>