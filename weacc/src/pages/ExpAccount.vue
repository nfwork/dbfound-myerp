<template>
  <div class="root">
  <div class="box"> 
    <div class="title">科目名称：</div>
    <input type="text" v-model="account_name"/>
  </div>
  <div class="box"> 
    <button class="bule-button" @click="query" >查 询</button>
    <button class="litter-bule-button" @click="addLine" >新增</button>
  </div>
  <div class="box"> 
    <div class="table-header">
      <div style="flex: 3;">科目名称</div>
      <div style="flex: 3;">科目类型</div>
      <div style="flex: 2;">排序</div>
      <div style="flex: 2;">首页展示</div>
    </div>
    <div class="table-body" style="min-height: 400px;">
      <div class="table-line mini-line" v-for="(item,index) in item_list" :key="item.account_id">
        <div @click="updateAccount(index,item)" style="flex: 3; text-align: center; color: #0f4ea0;">{{item.account_name}}</div>
        <div style="flex: 3; text-align: center;">{{item.account_type_des}}</div>
        <div style="flex: 2; text-align: center;">{{item.priority}}</div>
        <div style="flex: 2; text-align: center;">
          {{item.display_in_home==1?"是":""}}
        </div>
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

  <van-popup v-model="showUpdateBox" style="max-width:460px;width:90%;top:43%">
    <div class="popup-info-header">科目编辑</div>
    <div class="popup-row-info">
      <div class="box"> 
        <div class="title">科目名称：</div>
        <input type="text" v-model="current_line_account_name" />
      </div>
      <div class="box"> 
        <div class="title">科目类型：</div>
        <my-select class="my-select" :value="current_line_account_type" @select="setAccountType" :options="account_type_list" valueField="code_value" displayField="code_name"/>
      </div>
      <div class="box"> 
        <div class="title">排序：</div>
        <input type="number" v-model="current_line_priority"/>
      </div>
      <div class="box"> 
        <div class="title">首页展示：</div>
        <van-switch v-model="current_line_display_in_home" :active-value="1" :inactive-value="0" size="26px" style="margin-top:3px"  />
      </div>
    </div>
    <div class="popup-info-footer">
        <button class="litter-bule-button" @click="hiddenBox">取 消</button>
        <button class="bule-button" @click="saveAccount">保 存</button>
    </div>
  </van-popup>
  </div>
</template>

<script>
import { Toast,Dialog } from 'vant';
import request from '@/util/request';
export default {
    data(){
        return {
            item_list:[],
            account_name:'',
            limit : 10,
            totalCounts: 0,
            totalPages: 0,
            currentPage: 1,
            showIndex: 0,
            line_index: -1,
            showUpdateBox: false,
            current_line_account_type:{},
            current_line_account_name:"",
            current_line_priority:null,
            current_line_display_in_home:null,
            account_type_list: []
        }
    },
    methods:{
        hiddenBox(){
            this.showUpdateBox= false;
        },
        showBox(){
            this.showUpdateBox = true;
        },
        setAccountType(item){
            this.current_line_account_type = item;
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
        query(){
            let url = 'fnd/expAccount.query';
            let data ={
                limit : this.limit,
                start : (this.currentPage - 1) * this.limit,
                account_name: "%"+this.account_name+"%"
            };
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    this.item_list = res.data.datas;
                    this.totalCounts = res.data.totalCounts,
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
        },
        addLine(){
            this.line_index= -1;
            this.current_line_account_name= null;
            this.current_line_account_type= {};
            this.current_line_priority= null;
            this.current_line_display_in_home= null;
            this.showBox();
        },
        updateAccount(index,item){
            this.line_index = index;
            this.current_line_account_name = item.account_name;
            this.current_line_account_type = {
                code_value: item.account_type,
                code_name : item.account_type_des
            };
            this.current_line_priority= item.priority;
            this.current_line_display_in_home= item.display_in_home;
            this.showBox();
        },

        saveAccount(){
            if(!(this.current_line_account_name)){
                Toast.fail("科目名称不能为空！");
                return;
            }
            if(!(this.current_line_account_type)){
                Toast.fail("科目类型不能为空！")
                return;
            }
            let account_id ;
            let type = 'add';
            if(this.line_index > -1){
                account_id = this.item_list[this.line_index].account_id;
                type = "update";
            }
            let url = 'fnd/expAccount.execute!'+ type;
            let data = {
                account_id: account_id,
                account_name: this.current_line_account_name,
                account_type: this.current_line_account_type.code_value,
                display_in_home: this.current_line_display_in_home,
                priority: this.current_line_priority
            };
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    Dialog.alert({
                        title: '提示',
                        confirmButtonColor : "#2d6ca2",
                        message: '保存成功',
                    }).then(() => {
                        this.hiddenBox();
                        this.query();
                    });
                }else{
                    Toast.fail(res.data.message);
                }
            });
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.query();
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
.table-pager{
    margin-top: 5px;
}
</style>