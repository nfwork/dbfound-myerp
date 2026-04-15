<template>
  <div class="root">
    <div class="box">
      <div class="title">收益日期：</div>
      <my-calendar class="my-calendar" v-model="cost_date" />
    </div>
    <div class="box">
      <button class="bule-button" @click="query">查 询</button>
      <button class="litter-bule-button" @click="resetForm">重 置</button>
      <button class="yellow-button" @click="addLine">收益登记</button>
      <button class="green-button" @click="openAnnualCalc">年化测算</button>
    </div>

    <div class="summary-tab-box" :style="summaryTabBoxStyle">
      <div class="summary-tab-header">
        <div
          class="summary-tab-item"
          :class="{ active: summaryTab === 'monthly' }"
          @click="summaryTab = 'monthly'"
        >按月收益</div>
        <div
          class="summary-tab-item"
          :class="{ active: summaryTab === 'yearly' }"
          @click="summaryTab = 'yearly'"
        >按年收益</div>
        <div
          class="summary-tab-item"
          :class="{ active: summaryTab === 'summary' }"
          @click="summaryTab = 'summary'"
        >总收益</div>
      </div>
      <div class="summary-tab-body">
        <!-- 按月 / 按年：结构相同，仅数据源不同 -->
        <div
          v-show="summaryTab === 'monthly' || summaryTab === 'yearly'"
          class="monthly-profit-content"
        >
          <table class="monthly-profit-table">
            <thead>
              <tr>
                <th class="channel-label-col">渠道</th>
                <th v-for="item in annualProfitSource" :key="'p' + item.profit_period">{{ item.profit_period }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in CHANNEL_MATRIX_ROWS" :key="summaryTab + row.key">
                <td class="channel-label-col">{{ row.label }}</td>
                <td
                  v-for="col in annualProfitSource"
                  :key="summaryTab + col.profit_period + row.key"
                >{{ fmt(col[row.key]) }}</td>
              </tr>
              <tr class="monthly-total-row">
                <td class="channel-label-col">汇总</td>
                <td
                  v-for="col in annualProfitSource"
                  :key="'tot' + summaryTab + col.profit_period"
                >{{ fmt(col.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-show="summaryTab === 'summary'" class="summary-content">
          <div class="summary-row summary-row-header">
            <div class="summary-col">渠道</div>
            <div class="summary-col">当前收益</div>
            <div class="summary-col">已归档收益</div>
            <div class="summary-col">总收益</div>
          </div>
          <div
            v-for="row in SUMMARY_TABLE_ROWS"
            :key="row.label"
            class="summary-row"
          >
            <div class="summary-col">{{ row.label }}</div>
            <div class="summary-col">{{ fmt(profitSummary[row.cur]) }}</div>
            <div class="summary-col">{{ fmt(profitSummary[row.arch]) }}</div>
            <div class="summary-col">{{ fmt(profitSummary[row.tot]) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="data-table-box" :style="dataTableBoxStyle">
      <table class="data-table" :style="dataTableWidthStyle">
        <thead>
          <tr>
            <th class="sticky-col" style="width: 90px;">收益日期</th>
            <th v-for="h in DETAIL_HEADS" :key="h" style="width: 70px;">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in item_list"
            :key="item.record_id"
            :class="{ 'data-table-current-line': current_line === index }"
            @click="setIndex(index)"
          >
            <td
              class="sticky-col"
              style="width: 90px; text-align: center; color: #0f4ea0; cursor: pointer;"
              @click.stop="updateRecord(index, item)"
            >{{ item.cost_date }}</td>
            <td
              v-for="col in DETAIL_CHANNEL_COLS"
              :key="col.channel"
              style="width: 70px; text-align: center;"
            >
              {{ fmt(item[col.channel]) }}
              <div
                v-if="item[col.diff] != null"
                :style="diffStyle(item[col.diff])"
              >({{ fmt(item[col.diff]) }})</div>
            </td>
            <td style="width: 70px; text-align: center;">
              {{ fmt(item.channel_total) }}
              <div
                v-if="item.diff_total != null"
                :style="diffStyle(item.diff_total)"
              >({{ fmt(item.diff_total) }})</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-pager">
      <div class="desbox">
        显示 {{ pageRangeFrom }} 到 {{ pageRangeTo }} 条，共 {{ totalCounts }} 条，共 {{ totalPages }} 页
      </div>
      <div class="buttonbox">
        <button type="button" @click="changePage(1)" :disabled="currentPage === 1">{{ '<<' }}</button>
        <button type="button" @click="changePage(2)" :disabled="currentPage === 1">{{ '<' }}</button>
        <button type="button">{{ currentPage }} / {{ totalPages }}</button>
        <button type="button" @click="changePage(3)" :disabled="currentPage * limit >= totalCounts">{{ '>' }}</button>
        <button type="button" @click="changePage(4)" :disabled="currentPage * limit >= totalCounts">{{ '>>' }}</button>
      </div>
    </div>

    <van-popup v-model="showAnnualBox" style="max-width:460px;width:90%;top:43%">
      <div class="popup-info-header annual-header">
        <button type="button" class="annual-nav-btn" :disabled="annualCalcIndex <= 0" @click="switchAnnualMonth(-1)">&lt;</button>
        <span>年化收益测算 ({{ annualCalcMonth }})</span>
        <button
          type="button"
          class="annual-nav-btn"
          :disabled="annualCalcIndex >= annualProfitSource.length - 1"
          @click="switchAnnualMonth(1)"
        >&gt;</button>
      </div>
      <div class="popup-row-info annual-calc-body">
        <div class="annual-row annual-row-header">
          <div class="annual-col-channel">渠道</div>
          <div class="annual-col-profit">{{ annualProfitLabel }}</div>
          <div class="annual-col-principal">本金(万元)</div>
          <div class="annual-col-rate">年化率</div>
        </div>
        <div class="annual-scroll">
          <div
            v-for="(item, index) in annualCalcList"
            :key="index"
            class="annual-row"
            :class="{ 'annual-row-total': item.isTotal }"
          >
            <div class="annual-col-channel">{{ item.label }}</div>
            <div class="annual-col-profit">{{ fmt(item.profit) }}</div>
            <div class="annual-col-principal">
              <input v-if="!item.isTotal" type="number" v-model.number="item.principal" />
              <span v-else>{{ fmt(item.principal) }}</span>
            </div>
            <div class="annual-col-rate">
              <span v-if="item.rate !== null" :style="item.rate >= 0 ? 'color:#e74c3c' : 'color:#27ae60'">{{ item.rate }}%</span>
              <span v-else>-</span>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-info-footer">
        <button type="button" class="litter-bule-button" @click="showAnnualBox = false">关 闭</button>
        <button type="button" class="bule-button" @click="calcAnnualReturn">计 算</button>
      </div>
    </van-popup>

    <van-popup v-model="showUpdateBox" style="max-width:460px;width:90%;top:43%">
      <div class="popup-info-header">收益记录编辑</div>
      <div class="popup-row-info">
        <div class="box">
          <div class="title">收益日期：</div>
          <my-calendar class="my-calendar" v-model="current_line_cost_date" />
        </div>
        <div v-for="field in EDIT_FORM_FIELDS" :key="field.model" class="box">
          <div class="title">{{ field.title }}</div>
          <input type="number" v-model="currentLine[field.model]" />
        </div>
      </div>
      <div class="popup-info-footer">
        <button type="button" class="litter-bule-button" @click="hiddenBox">取 消</button>
        <button type="button" class="bule-button" @click="saveRecord">保 存</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import request from '@/util/request';

const PAGE_SIZE = 30;

/** 总收益 Tab 行配置：对应 profitSummary 字段名 */
const SUMMARY_TABLE_ROWS = [
  { label: '渠道PF', cur: 'current_channel_pf', arch: 'archived_channel_pf', tot: 'total_channel_pf' },
  { label: '渠道ZS', cur: 'current_channel_zs', arch: 'archived_channel_zs', tot: 'total_channel_zs' },
  { label: '渠道JT', cur: 'current_channel_jt', arch: 'archived_channel_jt', tot: 'total_channel_jt' },
  { label: '渠道AL', cur: 'current_channel_al', arch: 'archived_channel_al', tot: 'total_channel_al' },
  { label: '渠道JJ', cur: 'current_channel_jj', arch: 'archived_channel_jj', tot: 'total_channel_jj' },
  { label: '渠道汇总', cur: 'current_channel_total', arch: 'archived_channel_total', tot: 'total_channel_total' }
];

/** 按月/按年矩阵：每行对应接口字段名 */
const CHANNEL_MATRIX_ROWS = [
  { key: 'channel_pf', label: '渠道PF' },
  { key: 'channel_zs', label: '渠道ZS' },
  { key: 'channel_jt', label: '渠道JT' },
  { key: 'channel_al', label: '渠道AL' },
  { key: 'channel_jj', label: '渠道JJ' }
];

const DETAIL_HEADS = ['渠道PF', '渠道ZS', '渠道JT', '渠道AL', '渠道JJ', '汇总'];

const DETAIL_CHANNEL_COLS = [
  { channel: 'channel_pf', diff: 'diff_pf' },
  { channel: 'channel_zs', diff: 'diff_zs' },
  { channel: 'channel_jt', diff: 'diff_jt' },
  { channel: 'channel_al', diff: 'diff_al' },
  { channel: 'channel_jj', diff: 'diff_jj' }
];

const EDIT_FORM_FIELDS = [
  { title: '渠道PF：', model: 'channel_pf' },
  { title: '渠道ZS：', model: 'channel_zs' },
  { title: '渠道JT：', model: 'channel_jt' },
  { title: '渠道AL：', model: 'channel_al' },
  { title: '渠道JJ：', model: 'channel_jj' }
];

function emptyProfitSummary() {
  return {
    current_channel_pf: 0,
    current_channel_zs: 0,
    current_channel_jt: 0,
    current_channel_al: 0,
    current_channel_jj: 0,
    current_channel_total: 0,
    archived_channel_pf: 0,
    archived_channel_zs: 0,
    archived_channel_jt: 0,
    archived_channel_al: 0,
    archived_channel_jj: 0,
    archived_channel_total: 0,
    total_channel_pf: 0,
    total_channel_zs: 0,
    total_channel_jt: 0,
    total_channel_al: 0,
    total_channel_jj: 0,
    total_channel_total: 0
  };
}

function normalizeProfitSummaryRow(r) {
  const n = (v) => (v !== null && v !== undefined ? Number(v) : 0);
  return {
    current_channel_pf: n(r.current_channel_pf),
    current_channel_zs: n(r.current_channel_zs),
    current_channel_jt: n(r.current_channel_jt),
    current_channel_al: n(r.current_channel_al),
    current_channel_jj: n(r.current_channel_jj),
    current_channel_total: n(r.current_channel_total),
    archived_channel_pf: n(r.archived_channel_pf),
    archived_channel_zs: n(r.archived_channel_zs),
    archived_channel_jt: n(r.archived_channel_jt),
    archived_channel_al: n(r.archived_channel_al),
    archived_channel_jj: n(r.archived_channel_jj),
    archived_channel_total: n(r.archived_channel_total),
    total_channel_pf: n(r.total_channel_pf),
    total_channel_zs: n(r.total_channel_zs),
    total_channel_jt: n(r.total_channel_jt),
    total_channel_al: n(r.total_channel_al),
    total_channel_jj: n(r.total_channel_jj),
    total_channel_total: n(r.total_channel_total)
  };
}

function todayYmd() {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, '0');
  const d = String(t.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default {
  name: 'ProfitRecord',

  data() {
    return {
      CHANNEL_MATRIX_ROWS,
      SUMMARY_TABLE_ROWS,
      DETAIL_HEADS,
      DETAIL_CHANNEL_COLS,
      EDIT_FORM_FIELDS,
      item_list: [],
      cost_date: '',
      limit: PAGE_SIZE,
      totalCounts: 0,
      totalPages: 0,
      currentPage: 1,
      current_line: -1,
      line_index: -1,
      showUpdateBox: false,
      current_line_cost_date: '',
      currentLine: {
        channel_pf: null,
        channel_zs: null,
        channel_jt: null,
        channel_al: null,
        channel_jj: null
      },
      profitSummary: emptyProfitSummary(),
      monthly_profit_list: [],
      yearly_profit_list: [],
      summaryTab: 'monthly',
      showAnnualBox: false,
      annualCalcList: [],
      annualCalcMonth: '',
      annualCalcIndex: 0
    };
  },

  computed: {
    summaryTabBoxStyle() {
      return { width: `${this.width}px` };
    },
    dataTableBoxStyle() {
      return { width: `${this.width}px`, height: '485px', overflow: 'auto' };
    },
    dataTableWidthStyle() {
      return this.width === 580 ? { width: '580px' } : { width: '510px', borderTop: 'none' };
    },
    width() {
      let w = document.documentElement.clientWidth;
      if (w > 600) w = 600;
      return w - 20;
    },
    /** 按月/按年矩阵与年化弹窗共用同一套期间数据 */
    annualProfitSource() {
      return this.summaryTab === 'yearly' ? this.yearly_profit_list : this.monthly_profit_list;
    },
    annualPeriodMultiplier() {
      return this.summaryTab === 'yearly' ? 1 : 12;
    },
    annualProfitLabel() {
      return this.summaryTab === 'yearly' ? '年收益(元)' : '月收益(元)';
    },
    pageRangeFrom() {
      return (this.currentPage - 1) * this.limit + 1;
    },
    pageRangeTo() {
      const end = this.currentPage * this.limit;
      return end > this.totalCounts ? this.totalCounts : end;
    }
  },

  methods: {
    fmt(v) {
      return (Number(v) || 0).toFixed(2);
    },
    diffStyle(diff) {
      const n = Number(diff);
      let color = '';
      if (n > 0) color = 'red';
      else if (n < 0) color = 'green';
      return { marginLeft: '1px', color };
    },

    hiddenBox() {
      this.showUpdateBox = false;
    },
    showBox() {
      this.showUpdateBox = true;
    },
    setIndex(index) {
      this.current_line = index;
    },
    resetForm() {
      this.cost_date = '';
      this.currentPage = 1;
      this.query();
    },

    query() {
      request.post(
        'pf/profitRecord.query',
        {
          limit: this.limit,
          start: (this.currentPage - 1) * this.limit,
          cost_date: this.cost_date
        },
        { showLoadding: true }
      ).then((res) => {
        if (!res.data.success) return;
        this.item_list = res.data.datas;
        this.totalCounts = res.data.totalCounts;
        this.totalPages = Math.ceil(res.data.totalCounts / this.limit) || 1;
        this.checkPage();
      });
      this.fetchProfitTotalSummary();
      this.fetchMonthlyProfit();
      this.fetchYearlyProfit();
    },

    changePage(type) {
      const { currentPage, limit, totalCounts } = this;
      const lastPage = Math.ceil(totalCounts / limit) || 1;
      if (type === 1 && currentPage > 1) {
        this.currentPage = 1;
        this.query();
      } else if (type === 2 && currentPage > 1) {
        this.currentPage -= 1;
        this.query();
      } else if (type === 3 && currentPage * limit < totalCounts) {
        this.currentPage += 1;
        this.query();
      } else if (type === 4 && currentPage * limit < totalCounts) {
        this.currentPage = lastPage;
        this.query();
      }
    },

    checkPage() {
      if (this.currentPage > 1 && this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages < 2 ? 1 : this.totalPages;
        this.query();
      }
    },

    addLine() {
      this.line_index = -1;
      this.current_line_cost_date = todayYmd();
      this.currentLine = {
        channel_pf: null,
        channel_zs: null,
        channel_jt: null,
        channel_al: null,
        channel_jj: null
      };
      this.showBox();
    },

    updateRecord(index, item) {
      this.line_index = index;
      this.current_line_cost_date = item.cost_date;
      this.currentLine = {
        channel_pf: item.channel_pf,
        channel_zs: item.channel_zs,
        channel_jt: item.channel_jt,
        channel_al: item.channel_al,
        channel_jj: item.channel_jj
      };
      this.showBox();
    },

    base64UrlEncode(str) {
      return btoa(unescape(encodeURIComponent(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },
    base64UrlDecode(str) {
      let s = str.replace(/-/g, '+').replace(/_/g, '/');
      while (s.length % 4) s += '=';
      return decodeURIComponent(escape(atob(s)));
    },
    simpleEncrypt(str) {
      const key = 23;
      let out = '';
      for (let i = 0; i < str.length; i++) {
        out += String.fromCharCode(str.charCodeAt(i) ^ key);
      }
      return out;
    },
    simpleDecrypt(str) {
      return this.simpleEncrypt(str);
    },
    encodeConfigValue(str) {
      return this.base64UrlEncode(this.simpleEncrypt(str));
    },
    decodeConfigValue(str) {
      return this.simpleDecrypt(this.base64UrlDecode(str));
    },
    annualPrincipalConfigKey(month) {
      return `conf-pf-ap-${month}`;
    },
    loadPrincipalCache(month) {
      return request.post('pf/userConfig.query', {
        config_key: this.annualPrincipalConfigKey(month)
      }).then((res) => {
        if (res.data.success && res.data.datas && res.data.datas.length > 0) {
          try {
            return JSON.parse(this.decodeConfigValue(res.data.datas[0].config_value));
          } catch (e) {
            return {};
          }
        }
        return {};
      }).catch(() => ({}));
    },
    savePrincipalCache() {
      const cache = {};
      for (const item of this.annualCalcList) {
        if (item.isTotal) continue;
        if (item.principal > 0) cache[item.key] = item.principal;
      }
      request.post('pf/userConfig.execute!save', {
        config_key: this.annualPrincipalConfigKey(this.annualCalcMonth),
        config_value: this.encodeConfigValue(JSON.stringify(cache))
      });
    },

    openAnnualCalc() {
      if (!this.annualProfitSource || this.annualProfitSource.length === 0) {
        Toast.fail('请先查询收益数据');
        return;
      }
      this.annualCalcIndex = 0;
      this.loadAnnualMonth();
      this.showAnnualBox = true;
    },
    switchAnnualMonth(delta) {
      const newIndex = this.annualCalcIndex + delta;
      if (newIndex < 0 || newIndex >= this.annualProfitSource.length) return;
      this.annualCalcIndex = newIndex;
      this.loadAnnualMonth();
    },
    loadAnnualMonth() {
      const item = this.annualProfitSource[this.annualCalcIndex];
      this.annualCalcMonth = item.profit_period;
      this.annualCalcList = [
        { key: 'pf', label: '渠道PF', profit: item.channel_pf || 0, principal: null, rate: null },
        { key: 'zs', label: '渠道ZS', profit: item.channel_zs || 0, principal: null, rate: null },
        { key: 'jt', label: '渠道JT', profit: item.channel_jt || 0, principal: null, rate: null },
        { key: 'al', label: '渠道AL', profit: item.channel_al || 0, principal: null, rate: null },
        { key: 'jj', label: '渠道JJ', profit: item.channel_jj || 0, principal: null, rate: null },
        { key: 'total', label: '汇总', profit: item.total || 0, principal: null, rate: null, isTotal: true }
      ];
      this._principalSnapshot = JSON.stringify(this.annualCalcList.filter((i) => !i.isTotal).map((i) => i.principal));
      this.loadPrincipalCache(item.profit_period).then((cache) => {
        if (Object.keys(cache).length === 0) return;
        for (const row of this.annualCalcList) {
          if (!row.isTotal && cache[row.key]) row.principal = cache[row.key];
        }
        this._principalSnapshot = JSON.stringify(this.annualCalcList.filter((i) => !i.isTotal).map((i) => i.principal));
        this.calcAnnualReturn(false);
      });
    },
    calcAnnualReturn(userTriggered = true) {
      let hasInput = false;
      let totalPrincipal = 0;
      const totalItem = this.annualCalcList.find((i) => i.isTotal);
      for (const row of this.annualCalcList) {
        if (row.isTotal) continue;
        if (row.principal > 0) {
          hasInput = true;
          totalPrincipal += row.principal;
          row.rate = (row.profit / (row.principal * 10000) * this.annualPeriodMultiplier * 100).toFixed(2);
        } else {
          row.rate = null;
        }
      }
      if (!hasInput) {
        if (totalItem) {
          totalItem.principal = null;
          totalItem.rate = null;
        }
        if (userTriggered) Toast.fail('请至少填入一个渠道的本金');
        return;
      }
      if (totalItem) {
        totalItem.principal = totalPrincipal;
        totalItem.rate = totalPrincipal > 0
          ? (totalItem.profit / (totalPrincipal * 10000) * this.annualPeriodMultiplier * 100).toFixed(2)
          : null;
      }
      if (userTriggered) {
        const current = JSON.stringify(this.annualCalcList.filter((i) => !i.isTotal).map((i) => i.principal));
        if (current !== this._principalSnapshot) {
          this.savePrincipalCache();
          this._principalSnapshot = current;
        }
      }
    },
    saveRecord() {
      if (!this.current_line_cost_date) {
        Toast.fail('费用日期不能为空！');
        return;
      }
      let record_id;
      let type = 'add';
      if (this.line_index > -1) {
        record_id = this.item_list[this.line_index].record_id;
        type = 'update';
      }
      request.post(`pf/profitRecord.execute!${type}`, {
        record_id,
        cost_date: this.current_line_cost_date,
        channel_pf: this.currentLine.channel_pf,
        channel_zs: this.currentLine.channel_zs,
        channel_jt: this.currentLine.channel_jt,
        channel_al: this.currentLine.channel_al,
        channel_jj: this.currentLine.channel_jj
      }, { showLoadding: true }).then((res) => {
        if (res.data.success) {
          Dialog.alert({
            title: '提示',
            confirmButtonColor: '#2d6ca2',
            message: '保存成功'
          }).then(() => {
            this.hiddenBox();
            this.query();
          });
        } else {
          Toast.fail(res.data.message);
        }
      });
    },
    fetchProfitTotalSummary() {
      request.post('pf/report.query!totalSummary', { cost_date: this.cost_date }, { showLoadding: false })
        .then((res) => {
          if (res.data.success && res.data.datas && res.data.datas.length > 0) {
            this.profitSummary = normalizeProfitSummaryRow(res.data.datas[0]);
          } else {
            this.profitSummary = emptyProfitSummary();
          }
        });
    },
    fetchMonthlyProfit() {
      request.post('pf/report.query', { cost_date: this.cost_date }, { showLoadding: false }).then((res) => {
        this.monthly_profit_list = res.data.success ? (res.data.datas || []).reverse() : [];
      });
    },
    fetchYearlyProfit() {
      request.post('pf/report.query', {
        cost_date: this.cost_date,
        date_format: '%Y'
      }, { showLoadding: false }).then((res) => {
        this.yearly_profit_list = res.data.success ? (res.data.datas || []).reverse() : [];
      });
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.query();
    });
  }
};
</script>

<style scoped>
.title {
  width: 80px;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  float: left;
  text-align: right;
}
input {
  flex: 1;
  margin-top: 2px;
  float: left;
}
.table-pager {
  margin-top: 5px;
}

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

.annual-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}
.annual-nav-btn {
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
.annual-nav-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.annual-calc-body {
  padding: 0 10px;
}
.annual-row {
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #f0f0f0;
}
.annual-row-header {
  font-weight: 600;
  color: #555;
  font-size: 13px;
  background: #f8f8f8;
  border-radius: 4px;
}
.annual-row-total {
  background: #f0f4f8;
  font-weight: 600;
}
.annual-col-channel,
.annual-col-profit,
.annual-col-principal,
.annual-col-rate {
  flex: 1;
  text-align: center;
  font-size: 13px;
}
.annual-col-profit {
  text-align: center;
  padding-right: 6px;
}
.annual-col-rate {
  font-weight: bold;
}
.annual-col-principal input {
  width: 80%;
  max-width: 80px;
  height: 28px;
  font-size: 13px;
  text-align: right;
  padding: 0 4px;
  margin: 0;
}
.annual-scroll {
  max-height: 300px;
  overflow-y: auto;
}
</style>

