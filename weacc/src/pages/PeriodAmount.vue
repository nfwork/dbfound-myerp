<template>
  <div class="root">
  <div class="box">
    <van-radio-group v-model="year" direction="horizontal">
        <van-radio style="margin:3px;" icon-size="14" v-for="item in pitems" @click="itemChange()" :name="item.item_value" :key="item.item_value">{{item.item_name}}</van-radio>
    </van-radio-group>
  </div>

  <div class="data-table-box period-table-box" :style="'width:'+width+'px'">
    <table class="data-table period-table">
      <thead>
        <tr>
          <th class="sticky-col">会计期间</th>
          <th v-for="column in column_list" :key="column.priority">{{column.name}}</th>
        </tr>
      </thead>
      <tbody>
        <tr @click="setIndex(index)" :class="current_line==index?'data-table-current-line':''" v-for="(item,index) in item_list" :key="item.c">
          <td class="sticky-col">{{item.c}}</td>
          <td v-for="column in column_list" :key="column.priority">{{item[column.index] | currency}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import request from '@/util/request';
export default {
    data(){
        return {
            item_list:[],
            column_list:[],
            pitems:[],
            current_line:-1,
            year:""
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
        query(){
            let url ='report/periodAmountReport.query';
            let periodfrom = "";
            let periodto = "";
            if(this.year){
                periodfrom = this.year+"01",
                periodto = this.year+"12"
            }
            let data = {periodfrom,periodto};
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    let json={c:'合计'};
                    for(let i=0;i<res.data.datas.length;i++){
                      for(let j=0;j<res.data.columns.length;j++){
                        var column = res.data.columns[j];
                        var c = json[column.index];
                        if(c==null){
                            c=0;
                            json[column.index]=c;
                        }
                        var cc= res.data.datas[i][column.index];
                        if(cc>0){
                            json[column.index] = this.add(c,cc);
                        }
                      }
                    }
                    res.data.datas.push(json);
                    this.item_list = res.data.datas;
                    this.column_list = res.data.columns;
                }
            });
        },
        setIndex(index){
          this.current_line = index;
        },
        itemChange(){
            this.query();
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
        init() {
            let myDate = new Date();     
            let cyear=myDate.getFullYear();        //获取当前年
            let lastyear = cyear - 1;
            let lasttwoyear = cyear -2;
            let lastthreeyear = cyear -3;
            let pitems = [{item_name: cyear+"年", item_value: cyear,selected:true},
                            {item_name: lastyear + "年", item_value: lastyear,selected:false},
                            {item_name: lasttwoyear + "年", item_value:lasttwoyear,selected:false},
                            {item_name: lastthreeyear + "年", item_value:lastthreeyear,selected:false},
                            {item_name:"全部", item_value:"",selected:false}
                        ];
            let pitem = pitems[0].item_value;
            this.periodfrom = pitem+"01";
            this.periodto = pitem+"12";
            this.pitems = pitems;
            this.year = cyear;
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.init();
            vm.query();
        });
    }
}
</script>

<style scoped>
.box{
    margin-top: 5px;
}

/* 覆盖全局 data-table-box 的 overflow-y: hidden，此页面需要双向滚动 */
.period-table-box {
  margin-top: 10px;
  overflow: auto;
  max-height: calc(100vh - 180px);
}

/* 改用 border-separate 让每个单元格拥有独立边框，sticky 时边框不丢失 */
.period-table {
  width: max-content;
  border-collapse: separate;
  border-spacing: 0;
  border: none;
}

.period-table th,
.period-table td {
  min-width: 95px;
  height: 38px;
  padding: 2px 6px;
  text-align: right;
  font-size: 13px;
  border: none;
  border-right: 1px solid #dfe7ee;
  border-bottom: 1px solid #dfe7ee;
}

/* 表头加顶部边线 */
.period-table th {
  border-top: 1px solid #dfe7ee;
}

/* 表头锁定 */
.period-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  text-align: center;
}

/* 第一列锁定，加左边线代替 table 自身的左 border */
.period-table .sticky-col {
  position: sticky;
  left: 0;
  z-index: 1;
  min-width: 80px;
  text-align: center;
  background-color: #f6f6f6;
  border-left: 1px solid #dfe7ee;
}

.period-table tbody .sticky-col {
  background-color: #fff;
}

.period-table tbody tr:nth-child(even) .sticky-col {
  background-color: #f7f7f7;
}

/* 左上角单元格同时锁定行和列，z-index 最高 */
.period-table thead .sticky-col {
  z-index: 3;
}
</style>