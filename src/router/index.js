import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'common/js/cookie'

import Home from 'components/home/home'
import SmsList from 'components/smslist/smslist'
import Validate from 'components/validate/validate'
import Select from 'components/select/select'
import Send from 'components/send/send'
import TimingSend from 'components/timing-send/timing-send'
import DownList from 'components/downList/downList'
import Count from 'components/count/count'
import Page404 from 'components/404/404'
import Login from 'components/login/login'

Vue.use(Router)

let router = new Router({
  // mode: 'history',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'SMS一级导航',
      component: Home,
      redirect: '/list',
      // leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'el-icon-location', // 图标样式class
      meta: {
        auth: true
      },
      children: [
        {path: '/list', component: SmsList, name: 'SMS通道列表', menuShow: true},
        {path: '/validate', component: Validate, name: 'SMS通道验证', menuShow: true},
        {path: '/select', component: Select, name: 'SMS批次查询', menuShow: true},
        {path: '/send', component: Send, name: 'SMS批次发送', menuShow: true},
        {path: '/timingSend', component: TimingSend, name: 'SMS定时发送', menuShow: true},
        {path: '/downList', component: DownList, name: 'SMS下发列表', menuShow: true},
        {path: '/count', component: Count, name: 'SMS统计列表', menuShow: true}
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    // {
    //   path: '/',
    //   name: 'validate',
    //   component: Home,
    //   leaf: true, // 只有一个节点
    //   menuShow: true,
    //   iconCls: 'el-icon-menu', // 图标样式class
    //   meta: {
    //     auth: true
    //   },
    //   children: [
    //     {path: '/validate', component: Validate, name: 'SMS通道验证', menuShow: true}
    //   ]
    // },
    // {
    //   path: '/',
    //   name: 'select',
    //   component: Home,
    //   leaf: true, // 只有一个节点
    //   menuShow: true,
    //   iconCls: 'el-icon-setting', // 图标样式class
    //   meta: {
    //     auth: true
    //   },
    //   children: [
    //     {path: '/select', component: Select, name: 'SMS批次查询', menuShow: true}
    //   ]
    // },
    // {
    //   path: '/',
    //   name: 'modify',
    //   component: Home,
    //   leaf: true, // 只有一个节点
    //   menuShow: true,
    //   iconCls: 'el-icon-setting', // 图标样式class
    //   meta: {
    //     auth: true
    //   },
    //   children: [
    //     {path: '/modify', component: Modify, name: 'SMS用户修改', menuShow: true}
    //   ]
    // },
    // {
    //   path: '/',
    //   name: 'send',
    //   component: Home,
    //   leaf: true, // 只有一个节点
    //   menuShow: true,
    //   iconCls: 'el-icon-setting', // 图标样式class
    //   meta: {
    //     auth: true
    //   },
    //   children: [
    //     {path: '/send', component: Send, name: 'SMS批次发送', menuShow: true}
    //   ]
    // },
    // {
    //   path: '/',
    //   name: 'count',
    //   component: Home,
    //   leaf: true, // 只有一个节点
    //   menuShow: true,
    //   iconCls: 'el-icon-setting', // 图标样式class
    //   meta: {
    //     auth: true
    //   },
    //   children: [
    //     {path: '/count', component: Count, name: 'SMS统计列表', menuShow: true}
    //   ]
    // },
    // {
    //   path: '/',
    //   name: 'downList',
    //   component: Home,
    //   leaf: true, // 只有一个节点
    //   menuShow: true,
    //   iconCls: 'el-icon-setting', // 图标样式class
    //   meta: {
    //     auth: true
    //   },
    //   children: [
    //     {path: '/downList', component: DownList, name: 'SMS下发列表', menuShow: true}
    //   ]
    // },
    {
      path: '*',
      component: Page404
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    // 判断是否已登陆
    if (!Cookies.getValue('tokenId')) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
