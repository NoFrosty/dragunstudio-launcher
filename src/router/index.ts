import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/Index').default
    },
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/LoginView').default
    }
  ]
})
