import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/',
      name: 'log-list',
      component: require('@/components/LogList').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/setting',
      component: require('@/components/Setting').default
    },
    {
      path: '/login',
      component: require('@/components/Setting').default,
      meta: {
        isLogin: true
      }
    }
  ]
})
