<!--信手书 签名字-->
<template>
  <div :class="css.wrap">
    <iframe :src="src" ref="frame"></iframe>
  </div>
</template>
<script>
  import dateFormat from 'src/utils/dateFormat'
  export default {
    name: 'xxs-sign',
    props: {
      options: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        // 每次加载改一个戳，牺牲性能换取避免错误的缓存命中
        // 同一天使用同一个指纹，如果一天内会再次命中缓存(如果开启了的话)
        src: `/static/anySign2/index.html?date=${dateFormat(new Date(), 'yyyy-MM-dd')}`
      }
    },
    mounted () {
      const win = this.$refs.frame.contentWindow
      win.addEventListener('load', () => {
        win.baseSign(this.options, value => {
          this.$emit('finish', value)
        })
        win.document.querySelector('#btnCancel').addEventListener('click', () => {
          this.$emit('finish', null)
        })
      })
    }
  }
</script>
<style module="css" lang="less">
  .wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    box-sizing: border-box;
    background-color: white;

    iframe {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
  }
</style>
