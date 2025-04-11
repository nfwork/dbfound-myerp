<template>
  <div class="root">
    <div class="box"> 
      <div class="title">收益日期：</div>
      <my-calendar class="my-calendar" v-model="cost_date"/>
    </div>
    <div class="box"> 
      <button class="bule-button" @click="query">查 询</button>
      <button class="litter-bule-button" @click="resetForm">重 置</button>
      <button class="yellow-button" @click="addLine">新增</button>
    </div>
    <div class="box"> 
      <div class="table-header">
        <div style="flex: 2;">收益日期</div>
        <div style="flex: 2;">渠道PF</div>
        <div style="flex: 2;">渠道ZS</div>
        <div style="flex: 2;">渠道JT</div>
      </div>
      <div class="table-body" style="min-height: 400px;">
        <div @click="setIndex(index)" :class="'table-line mini-line '+(current_line==index?'table-line-current':'')" v-for="(item,index) in item_list" :key="item.record_id">
          <div @click="updateRecord(index,item)" style="flex: 2; text-align: center; color: #0f4ea0; line-height: 40px;">{{item.cost_date}}</div>
          <div style="flex: 2; text-align: center; display: inline-block; line-height: 40px;">
            {{item.channel_pf | currency}}<span v-if="index < item_list.length - 1 && item.channel_pf && item_list[index + 1].channel_pf" 
              :style="{'margin-left': '1px', 'color': (item.channel_pf - item_list[index + 1].channel_pf) >= 0 ? 'red' : 'green'}">
              ({{(item.channel_pf - item_list[index + 1].channel_pf).toFixed(2)}})
            </span>
          </div>
          <div style="flex: 2; text-align: center; display: inline-block; line-height: 40px;">
            {{item.channel_zs | currency}}<span v-if="index < item_list.length - 1 && item.channel_zs && item_list[index + 1].channel_zs" 
              :style="{'margin-left': '1px', 'color': (item.channel_zs - item_list[index + 1].channel_zs) >= 0 ? 'red' : 'green'}">
              ({{(item.channel_zs - item_list[index + 1].channel_zs).toFixed(2)}})
            </span>
          </div>
          <div style="flex: 2; text-align: center; display: inline-block; line-height: 40px;">
            {{item.channel_jt | currency}}<span v-if="index < item_list.length - 1 && item.channel_jt && item_list[index + 1].channel_jt" 
              :style="{'margin-left': '1px', 'color': (item.channel_jt - item_list[index + 1].channel_jt) >= 0 ? 'red' : 'green'}">
              ({{(item.channel_jt - item_list[index + 1].channel_jt).toFixed(2)}})
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="table-pager">
      <div class="desbox">显示 {{(currentPage-1)*limit+1}} 到 {{currentPage*limit > totalCounts?totalCounts:currentPage*limit}} 条，共 {{totalCounts}} 条，共 {{totalPages}} 页</div>
      <div class="buttonbox"> 
        <button @click="changePage(1)" :disabled="currentPage==1">{{"<<"}}</button>
        <button @click="changePage(2)" :disabled="currentPage==1">{{"<"}}</button>
        <button>{{currentPage}} / {{totalPages}}</button>
        <button @click="changePage(3)" :disabled="currentPage * limit >= totalCounts">{{">"}}</button>
        <button @click="changePage(4)" :disabled="currentPage * limit >= totalCounts">{{">>"}}</button>
      </div>
    </div>

    <van-popup v-model="showUpdateBox" style="max-width:460px;width:90%;top:43%">
      <div class="popup-info-header">利润记录编辑</div>
      <div class="popup-row-info">
        <div class="box"> 
          <div class="title">收益日期：</div>
          <my-calendar class="my-calendar" v-model="current_line_cost_date"/>
        </div>
        <div class="box"> 
          <div class="title">渠道PF：</div>
          <input type="number" v-model="current_line_channel_pf"/>
        </div>
        <div class="box"> 
          <div class="title">渠道ZS：</div>
          <input type="number" v-model="current_line_channel_zs"/>
        </div>
        <div class="box"> 
          <div class="title">渠道JT：</div>
          <input type="number" v-model="current_line_channel_jt"/>
        </div>
      </div>
      <div class="popup-info-footer">
        <button class="litter-bule-button" @click="hiddenBox">取 消</button>
        <button class="bule-button" @click="saveRecord">保 存</button>
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
            cost_date:'',
            limit : 10,
            totalCounts: 0,
            totalPages: 0,
            currentPage: 1,
            current_line: -1,
            line_index: -1,
            showUpdateBox: false,
            current_line_cost_date:"",
            current_line_channel_pf:null,
            current_line_channel_zs:null,
            current_line_channel_jt:null
        }
    },
    methods:{
        hiddenBox(){
            this.showUpdateBox= false;
        },
        showBox(){
            this.showUpdateBox = true;
        },
        setIndex(index){
          this.current_line = index;
        },
        resetForm() {
          this.cost_date = '';
          this.currentPage = 1;
          this.query(); // 重置后自动查询
        },
        query(){
            let url = 'pf/profitRecord.query';
            let data ={
                limit : this.limit,
                start : (this.currentPage - 1) * this.limit,
                cost_date: this.cost_date
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
            // 设置默认日期为当天
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            this.current_line_cost_date = `${year}-${month}-${day}`;
            this.current_line_channel_pf= null;
            this.current_line_channel_zs= null;
            this.current_line_channel_jt= null;
            this.showBox();
        },
        updateRecord(index,item){
            this.line_index = index;
            this.current_line_cost_date = item.cost_date;
            this.current_line_channel_pf = item.channel_pf;
            this.current_line_channel_zs = item.channel_zs;
            this.current_line_channel_jt = item.channel_jt;
            this.showBox();
        },
        saveRecord(){
            if(!this.current_line_cost_date){
                Toast.fail("费用日期不能为空！");
                return;
            }
            let record_id ;
            let type = 'add';
            if(this.line_index > -1){
                record_id = this.item_list[this.line_index].record_id;
                type = "update";
            }
            let url = 'pf/profitRecord.execute!'+ type;
            let data = {
                record_id: record_id,
                cost_date: this.current_line_cost_date,
                channel_pf: this.current_line_channel_pf,
                channel_zs: this.current_line_channel_zs,
                channel_jt: this.current_line_channel_jt
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