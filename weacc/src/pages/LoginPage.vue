<template>
    <div class="root">
        <img src="images/tx.jpg" class="logo">
        <div class="title">用户名：</div>
        <!-- 修改 @keyup.enter 事件监听，回车时聚焦到密码输入框 -->
        <input type="text" v-model="user_code" @keyup.enter="focusPassword" ref="userInput"/>
        <div class="title">密码：</div>
        <!-- 保留 @keyup.enter 事件监听，回车时执行登录 -->
        <input type="password" v-model="password" @keyup.enter="login" ref="passwordInput"/>
        <button style="width:100%;height:36px" class="bule-button" @click="login" >登 录</button>
        <button style="width:100%;height:36px" class="litter-bule-button" @click="register" >注 册</button>
    </div>
</template>

<script>
    import { Toast, Dialog } from 'vant';
    import request from '@/util/request';

    export default {
        data() {
            return {
                user_code: localStorage.getItem("user_code"),
                password: ""
            }
        },
        methods: {
            // 新方法：聚焦到密码输入框
            focusPassword() {
                this.$refs.passwordInput.focus();
            },
            login() {
                let url = 'sys/login.execute';
                let data = {
                    user_code: this.user_code,
                    password: this.password
                };
                request.post(url, data, { showLoadding: true }).then(res => {
                    if (res.data.success) {
                        localStorage.setItem("user_code", this.user_code)
                        this.$router.replace("/");
                    } else {
                        Toast.fail(res.data.message);
                    }
                });
            },
            register() {
                Dialog.alert({
                    title: '提示',
                    confirmButtonColor: "#2d6ca2",
                    message: 'We记账小程序暂不提供在线注册功能，如有需要请发送邮件到nfwork@163.com进行账号申请.',
                })
            },
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.password = "";
            });
        }
    }
</script>

<style scoped>
.logo {
    width: 100px;
    height: 100px;
    display: block;
    margin: 0 auto;
    margin-top: 40px;
}

.title {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: 600;
}

input {
    width: 100%;
}
</style>