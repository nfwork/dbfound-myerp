<template>
  <div class="root">
    <div class="box"> 
      <div class="title">收益日期：</div>
      <my-calendar class="my-calendar" v-model="cost_date"/>
    </div>
    <div class="box"> 
      <button class="bule-button" @click="query">查 询</button>
      <button class="litter-bule-button" @click="resetForm">重 置</button>
      <button class="yellow-button" @click="addLine">收益登记</button>
      <button class="green-button" @click="openAnnualCalc">年化测算</button>
    </div>
    <!-- Tab 切换：收益汇总 / 按月收益 -->
    <div class="summary-tab-box" :style="'width:'+width+'px;'">
      <div class="summary-tab-header">
        <div class="summary-tab-item" :class="{ active: summaryTab === 'monthly' }" @click="summaryTab = 'monthly'">按月收益</div>
        <div class="summary-tab-item" :class="{ active: summaryTab === 'summary' }" @click="summaryTab = 'summary'">汇总收益</div>
      </div>
      <div class="summary-tab-body">
        <!-- 收益汇总 -->
        <div v-show="summaryTab === 'summary'" class="summary-content">
          <div class="summary-row summary-row-header">
            <div class="summary-col">渠道</div>
            <div class="summary-col">当前收益</div>
            <div class="summary-col">已归档收益</div>
            <div class="summary-col">总收益</div>
          </div>
          <div class="summary-row">
            <div class="summary-col">渠道PF</div>
            <div class="summary-col">{{ (item_list.length > 0 ? (item_list[0].channel_pf || 0) : 0).toFixed(2) }}</div>
            <div class="summary-col">{{ (archiveSummary.total_channel_pf || 0).toFixed(2) }}</div>
            <div class="summary-col">{{ ((archiveSummary.total_channel_pf + (item_list.length > 0 ? item_list[0].channel_pf : 0)).toFixed(2) ) }}</div>
          </div>
          <div class="summary-row">
            <div class="summary-col">渠道ZS</div>
            <div class="summary-col">{{ (item_list.length > 0 ? (item_list[0].channel_zs || 0) : 0).toFixed(2) }}</div>
            <div class="summary-col">{{ (archiveSummary.total_channel_zs || 0).toFixed(2) }}</div>
            <div class="summary-col">{{ ((archiveSummary.total_channel_zs + (item_list.length > 0 ? item_list[0].channel_zs : 0)).toFixed(2) ) }}</div>
          </div>
          <div class="summary-row">
            <div class="summary-col">渠道JT</div>
            <div class="summary-col">{{ (item_list.length > 0 ? (item_list[0].channel_jt || 0) : 0).toFixed(2) }}</div>
            <div class="summary-col">{{ (archiveSummary.total_channel_jt || 0).toFixed(2) }}</div>
            <div class="summary-col">{{ ((archiveSummary.total_channel_jt + (item_list.length > 0 ? item_list[0].channel_jt : 0)).toFixed(2) ) }}</div>
          </div>
          <div class="summary-row">
            <div class="summary-col">渠道AL</div>
            <div class="summary-col">{{ (item_list.length > 0 ? (item_list[0].channel_al || 0) : 0).toFixed(2) }}</div>
            <div class="summary-col">{{ (archiveSummary.total_channel_al || 0).toFixed(2) }}</div>
            <div class="summary-col">{{ ((archiveSummary.total_channel_al + (item_list.length > 0 ? item_list[0].channel_al : 0)).toFixed(2) ) }}</div>
          </div>
          <div class="summary-row">
            <div class="summary-col">渠道JJ</div>
            <div class="summary-col">{{ (item_list.length > 0 ? (item_list[0].channel_jj || 0) : 0).toFixed(2) }}</div>
            <div class="summary-col">{{ (archiveSummary.total_channel_jj || 0).toFixed(2) }}</div>
            <div class="summary-col">{{ ((archiveSummary.total_channel_jj + (item_list.length > 0 ? item_list[0].channel_jj : 0)).toFixed(2) ) }}</div>
          </div>
          <div class="summary-row">
            <div class="summary-col">渠道汇总</div>
            <div class="summary-col">{{ (item_list.length > 0 ? (item_list[0].channel_total || 0) : 0).toFixed(2) }}</div>
            <div class="summary-col">{{ (archiveSummary.total_channel_total || 0).toFixed(2) }}</div>
            <div class="summary-col">{{ ((archiveSummary.total_channel_total + (item_list.length > 0 ? item_list[0].channel_total : 0)).toFixed(2) ) }}</div>
          </div>
        </div>
        <!-- 按月收益 -->
        <div v-show="summaryTab === 'monthly'" class="monthly-profit-content">
          <table class="monthly-profit-table">
            <thead>
              <tr>
                <th class="channel-label-col">渠道</th>
                <th v-for="item in monthly_profit_list" :key="'m'+item.profit_month">{{ item.profit_month }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="channel-label-col">渠道PF</td>
                <td v-for="item in monthly_profit_list" :key="'pf'+item.profit_month">{{ (item.channel_pf || 0).toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="channel-label-col">渠道ZS</td>
                <td v-for="item in monthly_profit_list" :key="'zs'+item.profit_month">{{ (item.channel_zs || 0).toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="channel-label-col">渠道JT</td>
                <td v-for="item in monthly_profit_list" :key="'jt'+item.profit_month">{{ (item.channel_jt || 0).toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="channel-label-col">渠道AL</td>
                <td v-for="item in monthly_profit_list" :key="'al'+item.profit_month">{{ (item.channel_al || 0).toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="channel-label-col">渠道JJ</td>
                <td v-for="item in monthly_profit_list" :key="'jj'+item.profit_month">{{ (item.channel_jj || 0).toFixed(2) }}</td>
              </tr>
              <tr class="monthly-total-row">
                <td class="channel-label-col">汇总</td>
                <td v-for="item in monthly_profit_list" :key="'t'+item.profit_month">{{ (item.total || 0).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="data-table-box" :style="'width:'+width+'px; height: 485px; overflow: auto;'">
      <table class="data-table" :style="width===580?'width: 580px;':'width: 510px; border-top:none;'">
        <thead>
          <tr>
            <th class="sticky-col" style="width: 90px;">收益日期</th>
            <th style="width: 70px;">渠道PF</th>
            <th style="width: 70px;">渠道ZS</th>
            <th style="width: 70px;">渠道JT</th>
            <th style="width: 70px;">渠道AL</th>
            <th style="width: 70px;">渠道JJ</th>
            <th style="width: 70px;">汇总</th> 
          </tr>
        </thead>
        <tbody>
          <tr @click="setIndex(index)" v-for="(item,index) in item_list" :key="item.record_id" :class="(current_line==index?'data-table-current-line':'')">
            <td class="sticky-col" @click="updateRecord(index,item)" style="width: 90px; text-align: center; color: #0f4ea0; cursor: pointer;">{{item.cost_date}}</td>
            <td style="width: 70px; text-align: center;">
              {{ (item.channel_pf || 0).toFixed(2) }}
              <div v-if="item.diff_pf !== undefined"
                :style="{'margin-left': '1px', 'color': item.diff_pf > 0 ? 'red' : item.diff_pf < 0 ? 'green' : ''}">
                ({{item.diff_pf.toFixed(2)}})
              </div>
            </td> 
            <td style="width: 70px; text-align: center;">
              {{ (item.channel_zs || 0).toFixed(2) }}
              <div v-if="item.diff_zs !== undefined"
                :style="{'margin-left': '1px', 'color': item.diff_zs > 0 ? 'red' : item.diff_zs < 0 ? 'green' : ''}">
                ({{item.diff_zs.toFixed(2)}})
              </div>
            </td>
            <td style="width: 70px; text-align: center;">
              {{ (item.channel_jt || 0).toFixed(2) }}
              <div v-if="item.diff_jt !== undefined"
                :style="{'margin-left': '1px', 'color': item.diff_jt > 0 ? 'red' : item.diff_jt < 0 ? 'green' : ''}">
                ({{item.diff_jt.toFixed(2)}})
              </div>
            </td>
            <td style="width: 70px; text-align: center;">
              {{ (item.channel_al || 0).toFixed(2) }}
              <div v-if="item.diff_al !== undefined"
                :style="{'margin-left': '1px', 'color': item.diff_al > 0 ? 'red' : item.diff_al < 0 ? 'green' : ''}">
                ({{item.diff_al.toFixed(2)}})
              </div>
            </td>
            <td style="width: 70px; text-align: center;">
              {{ (item.channel_jj || 0).toFixed(2) }}
              <div v-if="item.diff_jj !== undefined"
                :style="{'margin-left': '1px', 'color': item.diff_jj > 0 ? 'red' : item.diff_jj < 0 ? 'green' : ''}">
                ({{item.diff_jj.toFixed(2)}})
              </div>
            </td>
            <td style="width: 70px; text-align: center;">
              {{ (item.channel_total || 0).toFixed(2) }}
              <div v-if="item.diff_total !== undefined"
                :style="{'margin-left': '1px', 'color': item.diff_total > 0 ? 'red' : item.diff_total < 0 ? 'green' : ''}">
                ({{item.diff_total.toFixed(2)}})
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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

    <van-popup v-model="showAnnualBox" style="max-width:460px;width:90%;top:43%">
      <div class="popup-info-header annual-header">
        <button class="annual-nav-btn" :disabled="annualCalcIndex >= monthly_profit_list.length - 1" @click="switchAnnualMonth(1)">&lt;</button>
        <span>年化收益测算 ({{annualCalcMonth}})</span>
        <button class="annual-nav-btn" :disabled="annualCalcIndex <= 0" @click="switchAnnualMonth(-1)">&gt;</button>
      </div>
      <div class="popup-row-info annual-calc-body">
        <div class="annual-row annual-row-header">
          <div class="annual-col-channel">渠道</div>
          <div class="annual-col-profit">月收益(元)</div>
          <div class="annual-col-principal">本金(万元)</div>
          <div class="annual-col-rate">年化率</div>
        </div>
        <div class="annual-scroll">
          <div class="annual-row" v-for="(item, index) in annualCalcList" :key="index"
               :class="{'annual-row-total': item.isTotal}">
            <div class="annual-col-channel">{{item.label}}</div>
            <div class="annual-col-profit">{{(item.profit || 0).toFixed(2)}}</div>
            <div class="annual-col-principal">
              <input v-if="!item.isTotal" type="number" v-model.number="item.principal" placeholder="本金"/>
              <span v-else>{{(item.principal || 0).toFixed(2)}}</span>
            </div>
            <div class="annual-col-rate">
              <span v-if="item.rate !== null" :style="item.rate >= 0 ? 'color:#e74c3c' : 'color:#27ae60'">{{item.rate}}%</span>
              <span v-else>-</span>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-info-footer">
        <button class="litter-bule-button" @click="showAnnualBox = false">关 闭</button>
        <button class="bule-button" @click="calcAnnualReturn">计 算</button>
      </div>
    </van-popup>

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
          <div class="title">渠道AL：</div>
          <input type="number" v-model="current_line_channel_al"/>
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
            current_line_channel_al:null,
            current_line_channel_jj:null,
            archiveSummary: {
                total_channel_pf: 0,
                total_channel_zs: 0,
                total_channel_jt: 0,
                total_channel_al: 0,
                total_channel_jj: 0,
                total_channel_total: 0
            },
            monthly_profit_list: [],
            summaryTab: 'monthly',
            showAnnualBox: false,
            annualCalcList: [],
            annualCalcMonth: '',
            annualCalcIndex: 0
        }
    },
    computed:{
        width(){
            let width = document.documentElement.clientWidth ;
            if(width > 600){
                width = 600;
            }
            return width-20;
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
                            item.diff_al = (item.channel_al != null && nextItem.channel_al != null) 
                                ? item.channel_al - nextItem.channel_al : undefined;
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
            // 点击查询时刷新归档汇总数据
            this.fetchArchiveSummary();
            // 刷新按月收益数据
            this.fetchMonthlyProfit();
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
            this.current_line_channel_al= null;
            this.current_line_channel_jj= null; 
            this.showBox();
        },
        updateRecord(index,item){
            this.line_index = index;
            this.current_line_cost_date = item.cost_date;
            this.current_line_channel_pf = item.channel_pf;
            this.current_line_channel_zs = item.channel_zs;
            this.current_line_channel_jt = item.channel_jt;
            this.current_line_channel_al = item.channel_al;
            this.current_line_channel_jj = item.channel_jj;
            this.showBox();
        },
        base64UrlEncode(str){
            return btoa(unescape(encodeURIComponent(str)))
                .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        },
        base64UrlDecode(str){
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while(str.length % 4) str += '=';
            return decodeURIComponent(escape(atob(str)));
        },
        // 轻量可逆混淆：单字节固定 key 异或，复杂度 O(n)
        simpleEncrypt(str){
            const key = 23;
            let out = '';
            for(let i = 0; i < str.length; i++){
                out += String.fromCharCode(str.charCodeAt(i) ^ key);
            }
            return out;
        },
        simpleDecrypt(str){
            return this.simpleEncrypt(str);
        },
        encodeConfigValue(str){
            return this.base64UrlEncode(this.simpleEncrypt(str));
        },
        decodeConfigValue(str){
            return this.simpleDecrypt(this.base64UrlDecode(str));
        },
        annualPrincipalConfigKey(month){
            return 'conf-pf-ap-' + month;
        },
        loadPrincipalCache(month){
            return request.post('pf/userConfig.query', {
                config_key: this.annualPrincipalConfigKey(month)
            }).then(res => {
                if(res.data.success && res.data.datas && res.data.datas.length > 0){
                    try { return JSON.parse(this.decodeConfigValue(res.data.datas[0].config_value)); } catch(e) { return {}; }
                }
                return {};
            }).catch(() => ({}));
        },
        savePrincipalCache(){
            const cache = {};
            for(const item of this.annualCalcList){
                if(item.isTotal) continue;
                if(item.principal > 0){
                    cache[item.key] = item.principal;
                }
            }
            request.post('pf/userConfig.execute!save', {
                config_key: this.annualPrincipalConfigKey(this.annualCalcMonth),
                config_value: this.encodeConfigValue(JSON.stringify(cache))
            });
        },
        openAnnualCalc(){
            if(!this.monthly_profit_list || this.monthly_profit_list.length === 0){
                Toast.fail('请先查询收益数据');
                return;
            }
            this.annualCalcIndex = 0;
            this.loadAnnualMonth();
            this.showAnnualBox = true;
        },
        switchAnnualMonth(delta){
            const newIndex = this.annualCalcIndex + delta;
            if(newIndex < 0 || newIndex >= this.monthly_profit_list.length) return;
            this.annualCalcIndex = newIndex;
            this.loadAnnualMonth();
        },
        loadAnnualMonth(){
            const item = this.monthly_profit_list[this.annualCalcIndex];
            this.annualCalcMonth = item.profit_month;
            this.loadPrincipalCache(item.profit_month).then(cache => {
                this.annualCalcList = [
                    { key: 'pf', label: '渠道PF', profit: item.channel_pf || 0, principal: cache.pf || null, rate: null },
                    { key: 'zs', label: '渠道ZS', profit: item.channel_zs || 0, principal: cache.zs || null, rate: null },
                    { key: 'jt', label: '渠道JT', profit: item.channel_jt || 0, principal: cache.jt || null, rate: null },
                    { key: 'al', label: '渠道AL', profit: item.channel_al || 0, principal: cache.al || null, rate: null },
                    { key: 'jj', label: '渠道JJ', profit: item.channel_jj || 0, principal: cache.jj || null, rate: null },
                    { key: 'total', label: '汇总', profit: item.total || 0, principal: null, rate: null, isTotal: true }
                ];
                this._principalSnapshot = JSON.stringify(this.annualCalcList.filter(i => !i.isTotal).map(i => i.principal));
                if(this.annualCalcList.some(i => i.principal > 0)){
                    this.calcAnnualReturn(false);
                }
            });
        },
        calcAnnualReturn(userTriggered = true){
            let hasInput = false;
            let totalPrincipal = 0;
            const totalItem = this.annualCalcList.find(i => i.isTotal);
            for(const item of this.annualCalcList){
                if(item.isTotal) continue;
                if(item.principal > 0){
                    hasInput = true;
                    totalPrincipal += item.principal;
                    item.rate = (item.profit / (item.principal * 10000) * 12 * 100).toFixed(2);
                } else {
                    item.rate = null;
                }
            }
            if(!hasInput){
                if(totalItem) { totalItem.principal = null; totalItem.rate = null; }
                if(userTriggered) Toast.fail('请至少填入一个渠道的本金');
                return;
            }
            if(totalItem){
                totalItem.principal = totalPrincipal;
                totalItem.rate = totalPrincipal > 0
                    ? (totalItem.profit / (totalPrincipal * 10000) * 12 * 100).toFixed(2) : null;
            }
            if(userTriggered){
                const current = JSON.stringify(this.annualCalcList.filter(i => !i.isTotal).map(i => i.principal));
                if(current !== this._principalSnapshot){
                    this.savePrincipalCache();
                    this._principalSnapshot = current;
                }
            }
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
                channel_al: this.current_line_channel_al,
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
        // 新增获取归档汇总数据的方法
        fetchArchiveSummary() {
            let summaryUrl = 'pf/profitArchive.query!archiveSummary';
            let data = {
                cost_date: this.cost_date
            };
            request.post(summaryUrl, data, {showLoadding: true}).then(res => {
                if(res.data.success && res.data.datas.length > 0) {
                    const rawData = res.data.datas[0];
                    this.archiveSummary = {
                        total_channel_pf: rawData.total_channel_pf !== null ? rawData.total_channel_pf : 0,
                        total_channel_zs: rawData.total_channel_zs !== null ? rawData.total_channel_zs : 0,
                        total_channel_jt: rawData.total_channel_jt !== null ? rawData.total_channel_jt : 0,
                        total_channel_al: rawData.total_channel_al !== null ? rawData.total_channel_al : 0,
                        total_channel_jj: rawData.total_channel_jj !== null ? rawData.total_channel_jj : 0,
                        total_channel_total: rawData.total_channel_total !== null ? rawData.total_channel_total : 0
                    };
                } else {
                    // 如果没有数据，将汇总数据重置为 0
                    this.archiveSummary = {
                        total_channel_pf: 0,
                        total_channel_zs: 0,
                        total_channel_jt: 0,
                        total_channel_al: 0,
                        total_channel_jj: 0,
                        total_channel_total: 0
                    };
                }
            });
        },
        // 获取按月收益数据
        fetchMonthlyProfit() {
            let url = 'pf/report.query';
            let data = {
              cost_date: this.cost_date
            };
            request.post(url, data, {showLoadding: false}).then(res => {
                if(res.data.success) {
                    // 倒排数据，最新月份放前面
                    this.monthly_profit_list = (res.data.datas || []).reverse();
                } else {
                    this.monthly_profit_list = [];
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

/* Tab 容器 */
.summary-tab-box {
  margin-top: 6px;
  margin-bottom: 6px;
  border: 1px solid #dfe7ee;
  border-radius: 4px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.summary-tab-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dfe7ee;
}

.summary-tab-item {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.summary-tab-item.active {
  color: #2d6ca2;
  border-bottom-color: #2d6ca2;
  background-color: #fff;
}

.summary-tab-body {
  background-color: #fff;
  overflow: hidden;
}

/* 统一表格网格风格 */
.summary-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.summary-row-header {
  background-color: #f8f9fa;
  font-weight: 600;
}

.summary-row:last-child {
  border-bottom: none;
  background-color: #f0f4f8;
  font-weight: 600;
}

.summary-col {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #495057;
  padding: 8px 5px;
  border-right: 1px solid #e9ecef;
}

.summary-col:last-child {
  border-right: none;
}

.monthly-profit-content {
  overflow-x: auto;
  overscroll-behavior-x: none;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

.monthly-profit-table {
  width: max-content;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.monthly-profit-table th,
.monthly-profit-table td {
  min-width: 80px;
  padding: 8px 10px;
  text-align: center;
  font-size: 14px;
  color: #495057;
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.monthly-profit-table th:last-child,
.monthly-profit-table td:last-child {
  border-right: none;
}

.monthly-profit-table tbody tr:last-child td {
  border-bottom: none;
}

.monthly-profit-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #343a40;
}

.monthly-profit-table tbody tr {
  background-color: #fff;
}

.monthly-profit-table .channel-label-col {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #f8f9fa;
  font-weight: 600;
  color: #343a40;
  min-width: 64px;
  border-right: none;
  box-shadow: 1px 0 0 0 #dfe7ee;
}

.monthly-profit-table tbody .channel-label-col {
  background-color: #fff;
  font-weight: normal;
}

.monthly-profit-table .monthly-total-row td {
  font-weight: 600;
  background-color: #f0f4f8;
}

.monthly-profit-table .monthly-total-row .channel-label-col {
  background-color: #f0f4f8;
}

.annual-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
}
.annual-nav-btn{
    width: 32px;
    height: 32px;
    border: 1px solid #cbd0d8;
    background: #f8f9fa;
    color: #2d6ca2;
    font-size: 16px;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    line-height: 32px;
    padding: 0;
    margin: 0;
}
.annual-nav-btn:disabled{
    color: #ccc;
    cursor: not-allowed;
}
.annual-calc-body{
    padding: 0 10px;
}
.annual-row{
    display: flex;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #f0f0f0;
}
.annual-row-header{
    font-weight: 600;
    color: #555;
    font-size: 13px;
    background: #f8f8f8;
    border-radius: 4px;
}
.annual-row-total{
    background: #f0f4f8;
    font-weight: 600;
}
.annual-col-channel,
.annual-col-profit,
.annual-col-principal,
.annual-col-rate{
    flex: 1;
    text-align: center;
    font-size: 13px;
}
.annual-col-profit{
    text-align: center;
    padding-right: 6px;
}
.annual-col-rate{
    font-weight: bold;
}
.annual-col-principal input{
    width: 80%;
    max-width: 80px;
    height: 28px;
    font-size: 13px;
    text-align: right;
    padding: 0 4px;
    margin: 0;
}
.annual-scroll{
    max-height: 300px;
    overflow-y: auto;
}
</style>