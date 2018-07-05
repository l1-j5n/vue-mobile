
<template>
<div id="app">
  <router-view/>
  <router-view name="sidebar" v-if="showSideBar"/>
</div>
</template>

<script>
import stepBack from './stepBack'
// 注册一个全局函数 stepBack, 以便让native可以调用
window.stepBack = stepBack

export default {
  name: 'app',
  computed:{
    showSideBar(){
      return !this.$route.query.planType
    }
  },
  watch: {
    $route (to, from) {
      // 每进入一个新页面，重新绑定返回按钮的行为
      // 重新进入当前页面则不作处理
      // 如果页面没有定义返回按钮的行为，则绑定为默认行为`stepBack` (按步骤返回)
      if (to.name === from.name) return
      const {meta = {}} = to
      window.leftMenu(meta.leftMenu || {title: '返回', javascript: 'stepBack'})
      meta.title && window.SetH5Header(meta.title)
      if (meta.rightMenu === null) {
        window.toggleMenu(2, false)
      }
    }
  }
}
</script>
<style lang='less'>
  @import '../../assets/styles/weui/base/reset.less';
  @import '../../assets/styles/weui/widget/weui_cell/weui_cell_global';
  @import '../../assets/styles/weui/base/variable/color.less';
  html,body{height:100%}
  #app{
    height:100%;
    position:relative;
    background: @weuiBgColorDefault;
  }
</style>
