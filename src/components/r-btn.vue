<!--
  一个简单的按钮，保持了和原生<button>一样的API,但可以简化使用它，并略调整了一些默认参数，并某些方面增强了它

  注：

  debounce:
  如果用手指一直按住一个弹簧，它将不会弹起直到你松手为止。
  也就是说当调用动作n毫秒后，才会执行该动作，若在这n毫秒内又调用此动作则将重新计算执行时间。

  throttle:
  如果将水龙头拧紧直到水是以水滴的形式流出，那你会发现每隔一段时间，就会有一滴水流出。
  也就是会说预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期。

-->
<template>
  <button :class="[css.component, {
    [css.primary]: primary,
    [css.reverse]: reverse,
    [css.disabled]: disabled,
    [css.block]: block,
    [css.none]: none
  }]" type="button" @click="proxy"><slot>确认</slot></button>
</template>
<script>
  export default {
    name: 'RBtn',
    props: {
      disabled: Boolean,
      primary: Boolean,
      reverse: Boolean,
      block: Boolean,
      none: Boolean,
      debounce: {
        Type: Number,
        default: () => 400
      }
    },
    data () {
      return {
        lastActiveTime: null
      }
    },
    methods: {
      proxy (event) {
        let now = Date.now()
        if (this.lastActiveTime) {
          if (now - this.lastActiveTime < this.debounce) {
            event.preventDefault()
            event.stopPropagation()
            return
          }
        }
        this.$emit('click', event)
        this.lastActiveTime = now
      }
    }
  }
</script>
<style lang="less" module="css">
  @color-primary: #00aeff;
  @color-reverse: white;
  @color-disabled: #c0c0c0;

  .component {
    position: relative;
    border-radius: 4px;
    font-size: 18px;
    text-align: center;
    box-sizing: border-box;
    padding-right: 15px;
    padding-left: 15px;

    &:not(.none) {
      height: 45px;
    }

    &:focus {
      outline: 0 none;
    }
  }

  .primary {
    &:not(.reverse) {
      background: linear-gradient(to right, #67a4ff, #0062e8);
      color: white;
      border: 0 none;

      &.disabled {
        background: @color-disabled;
      }
    }

    &.reverse {
      border-color: #5697ff;
      color: #5697ff;
      background-color: white;
      overflow: hidden;

      &::after {
        content: ' ';
        position: absolute;
        width: 200%;
        height: 200%;
        left: 0;
        top: 0;
        transform: scale(0.5);
        transform-origin: 0 0;
        box-sizing: border-box;
        border: 1px solid #5697ff;
        border-radius: 8px;
      }


      &.disabled {
        color: @color-disabled;

        &::after {
          border-color: @color-disabled;
        }
      }
    }
  }

  .block {
    display: block;
    width: 100%;
  }

  .none {
    background: transparent;
    border: 0 none;
  }
</style>
