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
        <div class="title">会计期间：</div>
        <my-select class="my-select" :value="current_period" @select="setPeriod" :options="period_list" valueField="period_id" displayField="period_name"/>
    </div>
    <div class="box"> 
        <div class="title">费用日期：</div>
        <my-calendar class="my-calendar" v-model="exp_time"/>
    </div>
    <div class="box"> 
        <div class="title">借方科目：</div>
        <my-select class="my-select" :value="dr_account" @select="setDrAccount" :options="account_list" valueField="account_id" displayField="account_name"/>
    </div>
    <div class="box"> 
        <div class="title">贷方科目：</div>
        <my-select class="my-select" :value="cr_account" @select="setCrAccount" :options="account_list" valueField="account_id" displayField="account_name"/>
    </div>
    <div class="box"> 
        <div class="title">费用金额：</div>
        <input type="number" v-model="amount"/>
    </div>
    <div class="box"> 
        <div class="title">凭证描述：</div>
        <textarea v-model="description" cursor-spacing="120"></textarea>
    </div>
    <button style="width:100%;height:36px" class="bule-button" @click="save" >保存</button>
  </div>
</template>

<script>
import request from '@/util/request';
import { Toast, Dialog} from 'vant';

export default {
    data(){
        return {
            item_num:"系统自动生成",
            description:"",
            period_list:[],
            account_list:[],
            cr_account:{},
            dr_account:{},
            current_period:{},
            amount:'',
            exp_time:'',
            user_name:''
        }
    },
    methods :{
        setPeriod(item){
            this.current_period = item;
        },
        setCrAccount(item){
            this.cr_account = item;
        },
        setDrAccount(item){
            this.dr_account = item;
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
        save(){
            if(!this.current_period || !this.current_period.period_id){
                Toast.fail('会计期间不能为空');
                return;
            }
            let amount;
            if(this.amount && this.amount != 0){
                amount = this.amount * 1;
                amount = amount.toFixed(2);
            }else{
                Toast.fail('金额不能为空');
                return;
            }
            let url = 'exp/item.execute!simpleSave';
            let data ={
                exp_time:this.exp_time,
                description:this.description,
                amount:amount,
                period_id:this.current_period.period_id,
                cr_account_id:this.cr_account.account_id,
                dr_account_id:this.dr_account.account_id
            };
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    Dialog.alert({
                        title: '提示',
                        confirmButtonColor : "#2d6ca2",
                        message: '登记成功',
                    }).then(() => {
                        this.$router.replace("/itemManage?isAdd=1");
                    });
                }else{
                    Toast.fail(res.data.message)
                }
            });
        },
        init(){
            this.description = "";
            this.cr_account={};
            this.dr_account={};
            this.current_period={};
            this.amount='';
            this.getPeriodList();
            this.getAccountList();
            this.getBasic();
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.init();
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