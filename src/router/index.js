import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Status from '../components/Status.vue'
import Record from '../components/Record.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/ncov2020/status',
    children: [
      {
        path: '/ncov2020/status',
        component: Status
      },
      {
        path: '/ncov2020/record',
        component: Record
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
