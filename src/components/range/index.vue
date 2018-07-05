
import func from './vue-temp/vue-editor-bridge';
<!--********************************************************************
 * Author        : Geyan
 * Email         : geyan@zhongan.io
 * Create Date   : 2017-04-14 18:05
 * Filename      : range.vue
 * Description   : 水平滑槽

********************************************************************-->

<template>
  <div class='range-container'>
    <div class='range-base'>
      <div class='range-left'></div>
      <div class='range-slider' @touchstart.stop.prevent='startSlide'>
        <span v-if='follow' class='range-cur'>{{ curAge + unit }}</span>
      </div>
    </div>
    <span class='range-min'>{{ min + unit }}</span>
    <span class='range-max'>{{ max + unit }}</span>
  </div>
</template>

<script>
  export default {
    data: () => {
      return {
        startX: 0,
        leftX: 0,
        curAge: 0,
        offsetX: 0,
        totalX: 0,
        moving: false,
        slider: null,
        overlay: null
      }
    },
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      cur: {
        type: Number,
        default: 0
      },
      unit: {
        type: String,
        default: ''
      },
      follow: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      curAge: function (val) {
        // console.log(val)
        this.$emit('onChange', val)
      },
      cur: function (val) {
        // console.log('cur=' + val)
        this.curAge = val
        !this.moving && this.updateLeftByAge()
      },
      max: function (val) {
        this.updateLeftByAge()
      }
    },
    computed: {
    },
    methods: {
      startSlide (e) {
        let self = this
        this.startX = e.touches[0].screenX
        this.getLeftByView()
        this.$el.addEventListener('touchmove', this.moveSlide)
        this.$el.addEventListener('touchend', this.endSlide)
      },
      moveSlide (e) {
        this.moving = true
        const curX = e.touches[0].screenX
        const slider = this.slider
        const overlay = this.overlay
        let offset = parseInt(this.leftX) + curX - this.startX
        offset = offset < 0 ? 0 : (offset > this.totalX ? this.totalX : offset)
        // console.log('offset : ' + offset)
        this.offsetX = offset
        slider.style.left = this.offsetX + 'px'
        overlay.style.width = this.offsetX + 'px'

        this.curAge = Math.floor(this.min + (this.max - this.min) * offset / this.totalX)
      },
      endSlide (e) {
        this.$el.removeEventListener('touchmove', this.moveSlide)
        this.$el.removeEventListener('touchend', this.endSlide)
        this.moving = false
        this.startX = 0
      },
      onInit () {
        this.slider = this.$el.querySelector('.range-slider')
        this.overlay = this.$el.querySelector('.range-left')
        this.totalX = this.getCurCss(this.$el.querySelector('.range-base'), 'width').replace(/[a-zA-Z]/g, '')
        // console.log(this.totalX)
        this.initCur()
        this.updateLeftByAge()
      },
      getLeftByView () {
        let left = this.getCurCss(this.slider, 'left')
        this.leftX = left.replace(/[a-zA-Z]/g, '')
      },
      updateLeftByAge () {
        let _total = this.totalX
        let _left = (this.curAge - this.min) / (this.max - this.min) * _total
        this.slider.style.left = _left + 'px'
        this.overlay.style.width = _left + 'px'
      },
      getCurCss (obj, attr) {
        if (document.currentStyle) {
          return obj.currentStyle[attr]
        } else {
          let o = window.getComputedStyle(obj)
          return o ? o[attr] : ''
        }
      },
      initCur () {
        this.curAge = this.cur < this.min ? this.min : (this.cur > this.max) ? this.max : this.cur
      }
    },
    mounted () {
      this.onInit()
    }
  }
</script>

<style lang='less' scoped>
  .range-container {
    height: 32px;
    position:relative;
    padding-left: 50px;
    padding-right: 50px;
    .range-base {
      height: 8px;
      background-color:#d9f3ff;
      position:relative;
      border-radius: 4px;
      .range-left {
        position:absolute;
        left:0;
        top:0;
        height:100%;
        width: 40px;
        background-color:#00aeff;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .range-slider {
        position:absolute;
        left:0;
        top: -6px;
        width: 20px;
        height: 20px;
        margin-left:(-10px);
        border-radius: 10px;
        background-color:#f7f7f7;
        box-shadow: inset 0 0 0  6px #00aeff;
        .range-cur {
          position:absolute;
          left:0;
          right:0;
          top: 26px;
          margin:auto;
          width: 30px;
          font-size: 13px;
          font-weight:bold;
          word-break:keep-all;
          color:#00aeff;
        }
      }
    }
    .range-min {
      position:absolute;
      left: 0px;
      top: 0px;
      color:#999;
      font-size: 13px;
    }
    .range-max {
      position:absolute;
      right: 0px;
      top: 0px;
      color:#999;
      font-size: 13px;
    }
  }
</style>
