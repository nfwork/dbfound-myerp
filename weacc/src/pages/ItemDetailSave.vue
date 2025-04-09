<template>
  <div class="root">
    <div class="box"> 
        <div class="title">凭证编号：</div>
        <input type="text" disabled="true" style="background-color: #f1f1f1;" v-model="item_num"/>
    </div>
    <div class="box"> 
        <div class="title">登记用户：</div>
        <input type="text" disabled="true" style="background-color: #f1f1f1;" v-model="user_name"/>
    </div>
    <div class="box"> 
        <div class="title">登记时间：</div>
        <input type="text" disabled="true" style="background-color: #f1f1f1;" v-model="regist_time"/>
    </div>
    <div class="box"> 
        <div class="title">会计期间：</div>
        <my-select class="my-select" :value="current_period" @select="setPeriod" :options="period_list" valueField="period_id" displayField="period_name"/>
    </div>
    <div class="box"> 
        <div class="title">费用日期：</div>
        <my-calendar class="my-calendar" v-model="exp_time"/>
    </div>
    <div class="box"> 
        <div class="title">凭证描述：</div>
        <textarea cursor-spacing="120" v-model="description"></textarea>
    </div>
    <div class="box"> 
        <button class="bule-button" @click="save">保 存</button>
        <button class="litter-bule-button" @click="addLine">添加行</button>
    </div>

    <div class="box"> 
        <div class="table-header">
            <div style="width: 100px;">科目名称</div>
            <div style="width: 75px;">借</div>
            <div style="width: 75px;">贷</div>
            <div style="flex: 1;">行描述</div>
        </div>
        <div class="table-body"  style="max-height: 230px;min-height: 90px;">
            <div class="table-line" hover-class="table-line-hover" v-for="(item,index) in item_line_list" :key="index">
                <div @click="updateLine(index,item.account_id,item.account_name)" style="width: 100px;color: #0f4ea0;">{{item.account_name}}</div>
                <div class="num-font" style="width: 75px; text-align: right;">{{item.dr_amount | currency}}</div>
                <div class="num-font" style="width: 75px; text-align: right;">{{item.cr_amount | currency}}</div>
                <div style="flex: 1;">{{item.description}}</div>
            </div>
        </div>
    </div>

    <van-popup v-model="showUpdateBox" style="max-width:460px;width:90%;top:43%">
        <div class="popup-info-header">凭证行管理</div>
        <div class="popup-row-info">
            <div class="box"> 
                <div class="title">费用科目：</div>
                <my-select class="my-select" :value="current_line_account" @select="setAccount" :options="account_list" valueField="account_id" displayField="account_name"/>
            </div>
            <div class="box"> 
                <div class="title">借金额：</div>
                <input type="number" v-model="current_line_dr_amount"/>
            </div>
            <div class="box"> 
                <div class="title">贷金额：</div>
                <input type="number" v-model="current_line_cr_amount"/>
            </div>
            <div class="box"> 
                <div class="title">行描述：</div>
                <input type="text" v-model="current_line_description"/>
            </div>
        </div>
        <div class="popup-info-footer">
            <button class="litter-bule-button" @click="hiddenBox">取 消</button>
            <button class="bule-button" @click="saveLine">确 认</button>
        </div>
    </van-popup>

  </div>

</template>

<script>
import request from '@/util/request';
import { Toast,Dialog } from 'vant';
export default {
    data(){
        return {
            showUpdateBox : false,
            item_line_list:[],
            period_list:[],
            account_list:[],
            description: '',
            current_period: {},
            current_line_account: {},
            user_name:"",
            regist_time:"系统自动生成",
            item_num:"系统自动生成",
            item_id:"",
            line_index:-1,
            exp_time:"",
            current_line_dr_amount:null,
            current_line_cr_amount:null,
            current_line_description:"",
            current_line:{}
        }
    },
    methods:{
        hiddenBox(){
            this.showUpdateBox= false;
        },
        showBox(){
            this.showUpdateBox = true;
        },
        saveLine(){
            if(!this.current_line_account.account_id){
                Toast.fail("科目不能为空！")
                return;
            }
            if(!(this.current_line_cr_amount && this.current_line_cr_amount !=0)
                &&!(this.current_line_dr_amount && this.current_line_dr_amount !=0)){
                Toast.fail("借贷金额不能同时为空！");
                return;
            }
            if((this.current_line_cr_amount && this.current_line_cr_amount !=0)
                &&(this.current_line_dr_amount && this.current_line_dr_amount !=0)){
                Toast.fail("借贷金额不能同时有值！")
                return;
            }
            let item_line_list = this.item_line_list;
            let current_line_cr_amount;
            if(this.current_line_cr_amount){
                current_line_cr_amount = this.current_line_cr_amount * 1;
                current_line_cr_amount = current_line_cr_amount.toFixed(2);
            }
            let current_line_dr_amount;
            if(this.current_line_dr_amount){
                current_line_dr_amount = this.current_line_dr_amount * 1;
                current_line_dr_amount = current_line_dr_amount.toFixed(2);
            }
            if(this.line_index == -1){
                item_line_list.push({
                    cr_amount:current_line_cr_amount,
                    dr_amount:current_line_dr_amount,
                    description:this.current_line_description,
                    account_id:this.current_line_account.account_id,
                    account_name:this.current_line_account.account_name
                })
            }else{
                item_line_list[this.line_index].cr_amount = current_line_cr_amount;
                item_line_list[this.line_index].dr_amount = current_line_dr_amount;
                item_line_list[this.line_index].description = this.current_line_description;
                item_line_list[this.line_index].account_id = this.current_line_account.account_id;
                item_line_list[this.line_index].account_name = this.current_line_account.account_name;
            }
            //this.item_line_list = item_line_list;
            this.hiddenBox();
        },
        setPeriod(item){
            this.current_period = item;
        },
        setAccount(item){
            this.current_line_account = item;
        },
        addLine(){
            this.line_index= -1;
            this.current_line_account={};
            this.current_line_dr_amount="";
            this.current_line_cr_amount = "";
            this.current_line_description="";
            this.showBox();
        },
        save(){
            if(!this.current_period || !this.current_period.period_id){
                Toast.fail('会计期间不能为空')
                return;
            }
            if(this.item_line_list.length<2){
                Toast.fail('凭证行数必须大于等于2')
                return;
            }
            let dr_amount = 0;
            let cr_amount = 0;
            let datas = this.item_line_list;
            for (let i = 0; i < datas.length; i++) {
                let d_amount = datas[i].dr_amount;
                if (d_amount && d_amount != "" && d_amount !=null) {
                    dr_amount = this.add(dr_amount, d_amount);
                }
                let c_amount = datas[i].cr_amount;
                if (c_amount && c_amount != "" && c_amount != null) {
                    cr_amount = this.add(cr_amount, c_amount);
                }
            }
            if (dr_amount != cr_amount) {
                Toast.fail( "借贷不平，借方金额：" + dr_amount + "，贷方金额：" + cr_amount + "，请确认");
                return;
            }
            let url ='/exp/item.execute!saveHeaderAndLine';
            let data = {
                exp_time:this.exp_time,
                description:this.description,
                period_id:this.current_period.period_id,
                item_id:this.item_id,
                lines:this.item_line_list
            };
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    Dialog.alert({
                        title: '提示',
                        confirmButtonColor : "#2d6ca2",
                        message: '登记成功',
                    }).then(() => {
                        this.$router.replace("/itemManage");
                    });
                }else{
                    Toast.fail(res.data.message)
                }
            });
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
        updateLine(index,accountid,accountname){
            let data = this.item_line_list[index];
            this.line_index = index;
            this.current_line_cr_amount = data.cr_amount ;
            this.current_line_description = data.description;
            this.current_line_dr_amount = data.dr_amount;
            this.current_line_account = {account_id:accountid,
                                        account_name:accountname
                                        };
            this.showBox();
        },
        getAccountList(){
            let url = 'fnd/expAccount.query';
            let data ={};
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.account_list = res.data.datas;
                }
            });
        },
        getPeriodList(){
            let url = 'fnd/expPeriod.query!combo';
            let data ={};
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.period_list = res.data.datas;
                    this.current_period = this.period_list[0];
                }
            });
        },
        getBasic(){
            let url = 'exp/public.query!getDefaultPeriod';
            let data ={};
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.user_name = res.data.outParam.user_name;
                    this.exp_time = res.data.datas[0].exp_time
                }
            });
        },
        showDetail(e){
            let url = 'exp/itemLine.query';
            let data = {
                item_id: this.item_id,
                order : "asc"
            }
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.item_line_list = res.data.datas;
                }
            });
        },
        query(){
            let url= 'exp/item.query!getDeatil';
            let data = {
                item_id: this.item_id
            };
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.current_period = this.getPeriodById(res.data.datas[0].period_id);
                    this.exp_time = res.data.datas[0].exp_time;
                    this.description = res.data.datas[0].description;
                    this.user_name = res.data.datas[0].add_user;
                    this.regist_time = res.data.datas[0].regist_time;
                    this.item_num = res.data.datas[0].item_num;
                }
            });
        },
        getPeriodById(id){
            for(let period of this.period_list){
                if(period.period_id == id){
                    return period;
                }
            }
        },
        init(){
            this.description = "";
            this.item_id = "";
            this.exp_time ="";
            this.regist_time ="系统自动生成";
            this.item_num = "系统自动生成";
            this.current_period ={};
            // 清空表格数据
            this.item_line_list = []; 
            this.getPeriodList();
            this.getAccountList();
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.init();
            let item_id = to.query.item_id;
            if(item_id){
                vm.item_id =item_id;
                vm.query();
                vm.showDetail();
                vm.getBasic();
            }
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
textarea{
  flex: 1;
  height: 70px;
  margin-top: 2px;
}
</style>