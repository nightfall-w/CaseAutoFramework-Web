<template>
  <body id="poster">
    <el-form class="login-container" label-position="left" label-width="0px">
      <h3 class="login_title">系统登录</h3>
      <el-form-item>
        <el-input
          type="text"
          v-model="loginForm.username"
          auto-complete="off"
          placeholder="账号"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-input
          type="password"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%;background: #505458;border: none"
          v-on:click="login"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </body>
</template>

<script>
import { userLogin } from "network/login";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      responseResult: []
    };
  },
  methods: {
    login() {
      let data = {
        username: this.loginForm.username,
        password: this.loginForm.password
      };
      userLogin(data)
        .then(res => {
          console.log(res);
          const userToken = "JWT " + res.token;
          this.$store.commit("ADD_COUNT", {
            token: userToken,
            userName: res.username,
            userID: res.user_id
          });
          this.$notify({
            title: "成功",
            duration: 2500,
            message: "登录成功 欢迎" + this.loginForm.username,
            type: "success"
          });
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
          this.$notify.error({
            title: "错误",
            duration: 2500,
            message: "登录失败 请检查你的用户名密码是否正确"
          });
        });
    }
  }
};
</script>

<style>
#poster {
  background: url("~assets/images/eva.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
body {
  margin: 0px;
  padding: 0;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
