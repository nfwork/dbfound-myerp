<template>
  <div class="root">
  <div class="box">
    <van-radio-group v-model="year" direction="horizontal">
        <van-radio style="margin:3px;" icon-size="14" v-for="item in pitems" @click="itemChange()" :name="item.item_value" :key="item.item_value">{{item.item_name}}</van-radio>
    </van-radio-group>
  </div>

  <div class="header-box" :style="'width:'+width+'px'">
    <div class="table-header" :style="'width:' + ((column_list.length+1)*95) + 'px;'">
      <div>会计期间</div>
      <div v-for="column in column_list" :key="column.priority" >{{column.name}}</div>
    </div>

    <div class="table-body" :style="'width:' + ((column_list.length+1)*95) + 'px;'">
      <div @click="setIndex(index)" :class="current_line==index?'table-line table-line-current':'table-line'" v-for="(item,index) in item_list" :key="item.c">
        <div>{{item.c}}</div>
        <div class="num-font" v-for="column in column_list" :key="column.priority">{{item[column.index] | currency}}</div>
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
.header-box {
  overflow-x: scroll;
  margin-top: 10px;
  box-sizing: border-box;
}
.table-header{
  margin-top: 0;
}
.table-line{
  width: 100%;
}

.table-header div, .table-line div{
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  height: 40px;
  padding: 3px;
}
.table-line div{
  text-align: right;
}
.table-line :first-child{
  text-align: center;
}
</style>