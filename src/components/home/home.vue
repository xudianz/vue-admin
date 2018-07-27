<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <transition name="fade">
        <div class="topbar-logos" v-show="!collapsed">短信平台</div>
      </transition>
      <div class="topbar-logo topbar-btn" @click.prevent="toggleCollapse">
        <i class="iconfont" :class="computedClass"></i>
      </div>
      <div class="topbar-title">
        <span style="font-size: 18px;color: #fff;">后台管理系统</span>
      </div>
      <div class="topbar-account topbar-btn">
        <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
          <span class="el-dropdown-link"><i class="iconfont icon-user"></i>
            {{nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>退出账号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main-content">
      <!--左侧导航-->
      <aside :class="{'showSidebar':!collapsed}">
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-vertical-demo"
          :collapse="collapsed"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <template v-for="(item, index) in $router.options.routes" v-if="item.menuShow" class="menu-wrapper">
            <el-submenu v-if="!item.leaf" :index="index + ''" :key="index" ref="elSubmenu">
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span slot="title">{{item.name}}</span>
              </template>
              <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow" :class="{'is-active': $route.path === term.path}">
                <i :class="term.iconCls"></i><span slot="title">{{term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf && item.children && item.children.length" :index="item.children[0].path" :key="index" :class="{'is-active' :$route.path === item.children[0].path}">
              <i :class="item.iconCls"></i>
              <span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>
      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="content" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios'
import Cookies from 'common/js/cookie.js'

export default {
  data () {
    return {
      nickname: '1111',
      collapsed: false
    }
  },
  computed: {
    computedClass () {
      return this.collapsed ? 'icon-menuunfold' : 'icon-menufold'
    }
  },
  created () {
    this._getCookie()
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    handleCommand () {
      axios.post('/getview/web/u/logout').then(res => {
        let result = res.data
        if (result.code === '200' || result.code === 200) {
          this.$router.push({
            path: '/login'
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    _getCookie () {
      let nickname = Cookies.getValue('nickname')
      if (nickname) {
        this.nickname = nickname
      } else {
        this.nickname = '退出'
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.container
  position: absolute
  top: 0px
  bottom: 0px
  width: 100%
  .topbar-wrap
    height: 50px
    line-height: 50px
    background: #373d41
    padding: 0px
    .topbar-btn
      color: #fff
    .topbar-logo
      float: left
      width: 60px
      line-height: 50px
      text-align center
      cursor pointer
    .topbar-logos
      float: left
      width: 120px
      line-height: 50px
      color #ffffff
      font-weight bold
      font-size 23px
      text-align center
      &.fade-enter, &.fade-leave-to
        transform translate3d(-100%, 0, 0)
      &.fade-enter-active, &.fade-leave-active
        transition all .3s ease
    .topbar-logo img, .topbar-logos img
      height: 40px
      margin-top: 5px
      margin-left: 2px
    .topbar-title
      float: left
      text-align: left
      width: 200px
      padding-left: 10px
      border-left: 1px solid #000
    .topbar-account
      float: right
      padding-right: 30px
      .el-dropdown
        cursor pointer
        color #fff
        span
          display block
          height 100%
    .userinfo-inner
      cursor: pointer
      color: #fff
      padding-left: 10px
  .main-content
    display: -webkit-box
    display: -webkit-flex
    display: -ms-flexbox
    display: flex
    position: absolute
    top: 50px
    bottom: 0px
    overflow: hidden
    aside
      min-width: 50px
      background: #333744
      &::-webkit-scrollbar
        display: none
      &.showSidebar
        overflow-x: hidden
        overflow-y: auto
      .el-menu
        height: 100% /* 写给不支持calc()的浏览器 */
        height: -moz-calc(100% - 80px)
        height: -webkit-calc(100% - 80px)
        height: calc(100% - 80px)
        border-radius: 0px
        background-color: #333744
        border-right: 0px
        .el-submenu .el-menu-item
          min-width: 60px
      .el-menu
        width: 180px
      .el-menu--collapse
        width: 60px
    .el-menu .el-menu-item, .el-submenu .el-submenu__title
        height: 46px
        line-height: 46px
      .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover
        background-color: #7ed2df
  .content-container
    background: #fff
    flex: 1
    overflow-y: auto
    padding: 10px
    padding-bottom: 1px
    .content-wrapper
      background-color: #fff
      box-sizing: border-box
      .content-enter, .content-leave-to
        opacity 0
      .content-enter-active, .content-leave-active
        transition all .3s ease
</style>
