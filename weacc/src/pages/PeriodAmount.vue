<template>
  <div class="root">
  <div class="box">
    <van-radio-group v-model="year" direction="horizontal">
        <van-radio style="margin:3px;" icon-size="14" v-for="item in pitems" @click="itemChange()" :name="item.item_value" :key="item.item_value">{{item.item_name}}</van-radio>
    </van-radio-group>
  </div>

  <div class="data-table-box period-amount-table" :style="'width:'+width+'px; height:'+tableHeight+'px;'">
    <div class="period-amount-wrapper" :style="'width:' + tableWidth + 'px; min-width: 100%;'">
      <table class="data-table" :style="'width:' + tableWidth + 'px;'">
        <thead>
          <tr>
            <th style="width: 95px;">会计期间</th>
            <th v-for="column in column_list" :key="column.priority" style="width: 95px;">{{column.name}}</th>
          </tr>
        </thead>
      </table>
      <div class="data-table-content" :style="'width:' + tableWidth + 'px; height:' + contentHeight + 'px;'">
        <table class="data-table" :style="'width:' + tableWidth + 'px;'">
          <tbody>
            <tr @click="setIndex(index)" v-for="(item,index) in item_list" :key="item.c" :class="(current_line==index?'data-table-current-line':'')">
              <td style="width: 95px; text-align: center;">{{item.c}}</td>
              <td class="num-font" v-for="column in column_list" :key="column.priority" style="width: 95px; text-align: right;">{{item[column.index] | currency}}</td>
            </tr>
          </tbody>
        </table>
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
        },
        tableWidth(){
            return (this.column_list.length + 1) * 95;
        },
        tableHeight(){
            let h = document.documentElement.clientHeight;
            return Math.max(200, h - 152);
        },
        contentHeight(){
            return Math.max(150, this.tableHeight - 45);
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
</style>