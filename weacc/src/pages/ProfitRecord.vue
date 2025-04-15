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
        <div style="flex: 5;">收益日期</div>
        <div style="flex: 4;">渠道PF</div>
        <div style="flex: 4;">渠道ZS</div>
        <div style="flex: 4;">渠道JT</div>
        <div style="flex: 4;">渠道JJ</div>
        <div style="flex: 4;">汇总</div>  <!-- 新增汇总列 -->
      </div>
      <div class="table-body" style="height: 450px;">
        <div @click="setIndex(index)" :class="'table-line '+(current_line==index?'table-line-current':'')" v-for="(item,index) in item_list" :key="item.record_id">
          <div @click="updateRecord(index,item)" style="flex: 5; text-align: center; color: #0f4ea0; ">{{item.cost_date}}</div>
          <div style="flex: 4; text-align: center;">
            {{item.channel_pf | currency}}<span v-if="item.diff_pf !== undefined" 
                :style="{'margin-left': '1px', 'color': item.diff_pf > 0 ? 'red' : item.diff_pf < 0 ? 'green' : ''}">
                ({{item.diff_pf.toFixed(2)}})
            </span>
          </div>
          <div style="flex: 4; text-align: center;">
            {{item.channel_zs | currency}}<span v-if="item.diff_zs !== undefined" 
                :style="{'margin-left': '1px', 'color': item.diff_zs > 0 ? 'red' : item.diff_zs < 0 ? 'green' : ''}">
                ({{item.diff_zs.toFixed(2)}})
            </span>
          </div>
          <div style="flex: 4; text-align: center;">
            {{item.channel_jt | currency}}<span v-if="item.diff_jt !== undefined" 
                :style="{'margin-left': '1px', 'color': item.diff_jt > 0 ? 'red' : item.diff_jt < 0 ? 'green' : ''}">
                ({{item.diff_jt.toFixed(2)}})
            </span>
          </div>
          <div style="flex: 4; text-align: center;">
            {{item.channel_jj | currency}}<span v-if="item.diff_jj !== undefined" 
                :style="{'margin-left': '1px', 'color': item.diff_jj > 0 ? 'red' : item.diff_jj < 0 ? 'green' : ''}">
                ({{item.diff_jj.toFixed(2)}})
            </span>
          </div>
          <!-- 新增汇总列 -->
          <div style="flex: 4; text-align: center;">
            {{item.channel_total | currency}}<span v-if="item.diff_total !== undefined" 
                :style="{'margin-left': '1px', 'color': item.diff_total > 0 ? 'red' : item.diff_total < 0 ? 'green' : ''}">
                ({{item.diff_total.toFixed(2)}})
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
      <div class="popup-info-header">收益记录编辑</div>
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
        <div class="box"> 
          <div class="title">渠道JJ：</div>
          <input type="number" v-model="current_line_channel_jj"/>
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
            limit : 30,  // 将分页大小从10改为30
            totalCounts: 0,
            totalPages: 0,
            currentPage: 1,
            current_line: -1,
            line_index: -1,
            showUpdateBox: false,
            current_line_cost_date:"",
            current_line_channel_pf:null,
            current_line_channel_zs:null,
            current_line_channel_jt:null,
            current_line_channel_jj:null
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
                    // 优化差值计算逻辑
                    this.item_list.forEach((item, index) => {
                        if(index < this.item_list.length - 1) {
                            const nextItem = this.item_list[index + 1];
                            // 只有当前记录和下一记录都有值时才计算差值
                            item.diff_pf = (item.channel_pf != null && nextItem.channel_pf != null) 
                                ? item.channel_pf - nextItem.channel_pf : undefined;
                            item.diff_zs = (item.channel_zs != null && nextItem.channel_zs != null) 
                                ? item.channel_zs - nextItem.channel_zs : undefined;
                            item.diff_jt = (item.channel_jt != null && nextItem.channel_jt != null) 
                                ? item.channel_jt - nextItem.channel_jt : undefined;
                            item.diff_jj = (item.channel_jj != null && nextItem.channel_jj != null) 
                                ? item.channel_jj - nextItem.channel_jj : undefined;
                            item.diff_total = (item.channel_total != null && nextItem.channel_total != null) 
                                ? item.channel_total - nextItem.channel_total : undefined;
                        }
                    });
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
            this.current_line_channel_jj = item.channel_jj;
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
                channel_jt: this.current_line_channel_jt,
                channel_jj: this.current_line_channel_jj
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