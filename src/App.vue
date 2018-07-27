<template>
  <div id="app">
    <!-- <transition name="fade" mode="out-in">
      <router-view name="nav"></router-view>
    </transition> -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#app
  width 100%
  height 100%
.fade-enter-active, .fade-leave-active
  transition opacity .2s
.fade-enter, .fade-leave-to
  opacity 0
</style>
