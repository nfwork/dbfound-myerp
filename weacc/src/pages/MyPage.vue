<template>
  <div class="root">
    <div class="box"> 
        <img src="images/tx.jpg" class="logo">
    </div>
    <div class="box"> 
        <div class="title">用户名：</div>
        <div class="value">{{user_code}}</div>
    </div>
    <div class="box"> 
        <div class="title">昵 称：</div>
        <div class="value">{{user_name}}</div>
    </div>
    <div class="box"> 
        <div class="title">账号性质：</div>
        <div class="value">{{role_description}}</div>
    </div>
    <div class="box"> 
        <div class="title">微信绑定：</div>
        <div class="value">{{openid?"已绑定":"未绑定"}}</div>
    </div>
    <div class="box"> 
        <div class="title">日 期：</div>
        <div class="value">{{exp_time}}</div>
    </div>
    <div class="box"> 
        <div class="title">会计期间：</div>
        <div class="value">{{period==null?"无可用期间":period}}</div>
    </div>

    <div class="box function"> 
        <div @click="showBox">修改密码</div>
        <div bindtap="bind">绑定微信</div>
        <div @click="logout">注销登录</div>
    </div>

    <!-- 中间弹窗 -->
    <div class="popup-box" v-if="showIndex==1" bindtap="closePopup"></div> 
    <div class="popup-info-center" style="top:60px;" v-if="showIndex==1">
        <div class="popup-info-header">密码修改</div>
        <div class="popup-row-info">
            <div class="box"> 
                <div class="title">原密码：</div>
                <input type="password" v-model="ypassword" />
            </div>
            <div class="box"> 
                <div class="title">新密码：</div>
                <input type="password" v-model="password"/>
            </div>
            <div class="box"> 
                <div class="title">确认新密码：</div>
                <input type="password" v-model="password2"/>
            </div>
        </div>
        <div class="popup-info-footer">
            <button class="litter-bule-button" @click="hiddenBox">取 消</button>
            <button class="bule-button" @click="updatePassword">保 存</button>
        </div>
    </div>
</div>
</template>

<script>
import { Toast,Dialog } from 'vant';
import request from '@/util/request';
export default {
    data(){
        return {
            user_code:"",
            user_name:"",
            role_code:"",
            role_description:"",
            exp_time:"",
            period:"",
            showIndex: 0,
            ypassword:"",
            password:"",
            password2:"",
            openid:""
        }
    },
    methods : {
        getBasic(){
            let url = "exp/public.query!getDefaultPeriod";
            let data = {}
            request.post(url, data).then(res => {
                if(res.data.success){
                    this.user_name = res.data.outParam.user_name,
                    this.user_code = res.data.outParam.user_code,
                    this.role_code = res.data.outParam.role_code,
                    this.role_description = res.data.outParam.role_description,
                    this.openid = res.data.outParam.openid,
                    this.exp_time = res.data.datas[0].exp_time,
                    this.period = res.data.datas[0].period
                }
            }).catch(error => {
                console.error('Error:', error);
            });
        },
        updatePassword(){
            if(!(this.ypassword)){
                Toast.fail("原密码不能为空！")
                return;
            }
            if(!(this.password) || this.password != this.password2){
                Toast.fail("两次输入新密码不一致！")
                return;
            }
            let url = '/sys/login.execute!updatePassword';
            let data = {
                password: this.password,
                ypassword: this.ypassword
            }
            request.post(url, data, {showLoadding:true}).then(res => {
                if(res.data.success){
                    this.ypassword = "";
                    this.password2 = "";
                    this.password = "";
                    Toast.success("修改成功");
                    this.hiddenBox();
                }else{
                    Toast.fail(res.data.message);
                }
            });
        },
        hiddenBox(){
            this.showIndex= 0;
        },
        showBox(){
            this.showIndex=1
        },
        logout(){
            Dialog.confirm({
                title: '提示',
                message: '确认要退出登录吗？',
                confirmButtonColor : "#2d6ca2"
            }).then(() => {
                let url = "user.do!logout"
                request.post(url).then(res => {
                    this.$router.replace({ path: "/login" });
                });
            }).catch(() => {
            });
        }
    },
    mounted(){
        this.getBasic();
    }
}
</script>

<style scoped>
.root .box{
    display: flex;
    width: 100%;
    justify-content: center;
}

.logo{
  width: 100px;
  height: 100px;
  display: block;
  margin: 40px;
}

.title{
  width: 120px;
  height: 40px;
  line-height: 40px;
  float: left;
  text-align: center;
  font-size: 16px;
}

.value{
  width: 180px;
  height: 25px;
  line-height: 25px;
  float: left;
  text-align: center;
  padding: 2px;
  padding-left: 5px;
  font-size: 16px;
  border-bottom: 1px solid #ccc; 
}

.function{
  color:#0f4ea0;
  font-size: 14px;
  margin-top: 20px;
}

.function div{
  padding: 3px;
  width: 80px;
  text-align: center;
  display: inline-block;
}

input{
  flex: 1;
  margin-top: 3px;
  float: left;
}
</style>