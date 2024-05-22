<template>
    <div class="root">
        <img src="images/tx.jpg" class="logo">
        <div class="title">用户名：</div>
        <input type="text" v-model="user_code"/>
        <div class="title">密码：</div>
        <input type="password" v-model="password"/>
        <button style="width:100%;height:36px" class="bule-button" @click="login" >登 录</button>
        <button style="width:100%;height:36px" class="litter-bule-button" @click="register" >注 册</button>
    </div>
</template>

<script>
    import request from '@/util/request';

    export default {
        data(){
            return {
                user_code:"",
                password:""
            }
        },
        methods:{
             login(){
                let url = 'sys/login.execute';
                let data = {
                    user_code:this.user_code,
                    password:this.password
                };
                request.post(url,data).then(res => {
                    if(res.data.success){
                        this.$router.replace("/");
                    }else{
                        alert(res.data.message);
                    }
                });
            },

            register(){
                alert('We记账小程序暂不提供在线注册功能，如有需要请发送邮件到nfwork@163.com进行账号申请；');
            },
        }
    }
</script>

<style scoped>
.logo{
  width: 100px;
  height: 100px;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
}

.title{
  width: 100%;
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: bold;
}

input{
  width: 100%;
}
</style>