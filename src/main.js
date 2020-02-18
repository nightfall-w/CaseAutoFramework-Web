/*
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2019-11-16 22:38:44
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-14 12:58:58
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import Router from 'vue-router'
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:8000/api'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}