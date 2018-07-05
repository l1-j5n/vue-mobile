<template>
  <div class="containner">
    <ul>
      <li v-for="(item, index) in options" @click="change(item.value)" :class="{ 'nospace': position == 'right' }" :key="index" v-waves>
        <div :class="['unSelect', {'Selected': item.value == isSelect}]"></div>
        <div :class="['title', {'titleLeft': position == 'left'}]">{{item.key}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import waves from 'src/directives/waves' // 水波纹指令
export default {
  name: "Radio",
  directives: {
    waves
  },
  props: {
    checked: {
      default: null
    },
    options: {
      type: Array,
      required: true
    },
    position: {
      type: String
    }
  },
  data () {
    return {
      isSelect: this.checked
    }
  },
  watch: {
    checked: function (val) {
      this.change(val)
    }
  },
  methods: {
    change(val) {
      this.isSelect = val
      this.$emit('input', val)
    }
  },
  computed: {
  }
};
</script>
<style lang="less" scoped>
.containner {
  li{
    background: #fff;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  li.nospace {
    justify-content: inherit;
  }
  li.nospace .title {
    margin-left: 10px;
  }
  li:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    left: 10px;
  }
  li:nth-child(1)::before {
    border-top: 0;
  }
  .unSelect {
    width: 40/2px;
    height: 40/2px;
    background: url(~@/assets/styles/images/unSelect.png);
    background-size: 100% 100%;
    color: rgba(255, 255, 255, 1);
    order: 2
  }
  .Selected {
    width: 40/2px;
    height: 40/2px;
    background: url(~@/assets/styles/images/Selected.png);
    background-size: 100% 100%;
  }
  .title {
    order: 3
  }
  .titleLeft {
    order: 1
  }
}
</style>

