/*
 * @Descripttion:
 * @version:
 * @Author: wangbaojun
 * @Date: 2019-11-16 22:38:44
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-03-20 14:03:16
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// import axios from "axios";
import Router from "vue-router";
import iView from "iview";
import Vuex from "vuex";
//引入拖拽排序插件
import VueDND from "awe-dnd";
import vcrontab from "vcrontab";
import JsonViewer from 'vue-json-viewer'
import echarts from 'echarts'
import 'echarts/theme/macarons'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
Vue.use(JsonViewer);
Vue.use(vcrontab);
Vue.use(VueDND);
Vue.use(Vuex);
Vue.config.productionTip = false;
Vue.config.devtools = true;
// Vue.prototype.$http = axios.create({
//   baseURL: "http://localhost:8000/api"
// });

const ADD_COUNT = "ADD_COUNT"; // 用常量代替事件类型，使得代码更清晰
const REMOVE_COUNT = "REMOVE_COUNT";
const SWAICH_PROJECT = "SWAICH_PROJECT";
//注册状态管理全局参数
var store = new Vuex.Store({
  state: {
    token: "",
    userID: "",
    userName: "",
    currentProjectID: "",
    currentProjectName: ""
  },
  mutations: {
    //写法与getters相类似
    //组件想要对于vuex 中的数据进行的处理
    //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
    //内部操作必须在此刻完成(同步)
    [ADD_COUNT](state, userinfo) {
      // 第一个参数为 state 用于变更状态 登录
      console.log(userinfo);
      localStorage.setItem("token", userinfo.token);
      localStorage.setItem("userID", userinfo.userID);
      localStorage.setItem("userName", userinfo.userName);
      localStorage.setItem("displayName", userinfo.displayName);
      localStorage.setItem("email", userinfo.email);
      state.token = userinfo.token;
      state.userID = userinfo.userID;
      state.userName = userinfo.userName;
      state.displayName = userinfo.displayName;
      state.email = userinfo.email
      console.log(state)
    },
    [REMOVE_COUNT](state, token) {
      // 退出登录

      localStorage.removeItem("token", token);
      state.token = "";
    },
    [SWAICH_PROJECT](state, currentProject) {
      // 切换项目
      sessionStorage.setItem("currentProjectID", parseInt(currentProject.id));
      sessionStorage.setItem("currentProjectName", currentProject.name);
      state.currentProjectID = parseInt(currentProject.id);
      state.currentProjectName = currentProject.name;
    }
  }
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start(); //loadong 效果

  store.state.token = localStorage.getItem("token"); //获取本地存储的token
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (store.state.token) {
      // 通过vuex state获取当前的token是否存在
      store.state.currentProjectID = sessionStorage.getItem("currentProjectID");
      if (store.state.currentProjectID || to.path.split("/")[2] == "project") {
        next();
      } else {
        // next()
        next({
          path: "/toolsweb/project/index",
          query: { redirect: to.fullPath }
        });
        ElementUI.Message({
          message: '请先创建或选择一个项目，点击使用',
          type: 'warning'
        });
      }
    } else {
      next({
        path: "/toolsweb/login",
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next(
    );
  }
});

router.afterEach(route => {
  console.log(route);
  iView.LoadingBar.finish();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
