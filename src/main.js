import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/display.css'
import './assets/css/global.css'

import axios from 'axios'

import echarts from 'echarts'

// import bmap from 'vue-baidu-map'
Vue.prototype.$echarts = echarts

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$http = axios

// Vue.use(bmap, {
//   ak: 'cOMte8vsx6czxnjeGpIXDISBs8Cumk6v'
// })

// 请求根路径
// axios.defaults.baseURL = 'http://192.168.1.108:3000/api/'
// // axios 请求拦截
// axios.interceptors.request.use(config => {
//   console.log(config)
//   // config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
