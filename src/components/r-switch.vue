<!--
  切换组件（“是”，“否”）
  通过v-model绑定
  调用形式：
  <r-switch v-model="value"/>
  初始时可以先给null或者''，但这时不选中任何一极
  接受两组值
  1. 'Y' 和 'N'
  2. 'y' 和 'n'
  它们会自动处理
-->
<template>
  <span class="r-switch"  :class="act">
    <i v-for="(value,key) in map" @click="check(key)" :key="key">{{value}}</i>
  </span>
</template>
<script>
  export default {
    name: 'RSwitch',
    model: {
      prop: 'value',
      event: 'update'
    },
    props: {
      value: [String, Boolean],
      readonly: Boolean,
      map: {
        Type: Object,
        default () {
          return {Y: '是', N: '否'}
        }
      }
    },
    computed: {
      act: {
        get () {
          return this.value ? ({Y: 'yes', N: 'no'})[this.value.toUpperCase()] : null
        }
      },
      isLowerCase: {
        get () {
          return this.value && this.value.toLowerCase() === this.value
        }
      }
    },
    methods: {
      check (value) {
        if (this.readonly || this.value === value) return
        this.$emit('update', this.isLowerCase ? value.toLowerCase() : value)
      }
    }
  }
</script>
<style lang='less'>
  @color-primary: #5697ff;
  .r-switch {
    display: flex;
    height: 25px;
    overflow: hidden;
    width: 70px;
    margin-left: 20px;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 5px;

    i {
      font-style: normal;
      flex: 1;
      text-align: center;
      color: #999;
      padding: 0;
      display: block;
      height: 100%;
      line-height: 25px;
    }

    i + i {
      border-left: 1px solid #ddd;
    }

    &.yes,
    &.no {
      border: 1px solid @color-primary;
    }

    &.yes {
      :first-child {
        background-color: @color-primary;
        color: white;
      }
    }

    &.no {
      :last-child {
        background-color: @color-primary;
        color: white;
      }
    }
  }
</style>
