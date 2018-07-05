<template>
<!-- 自定义slot tab组件 -->
  <div class="tabs">
    <div class="tabs-bar">
      <div :class="tabCls(item)" v-for="(item,index) in navList" @click="handleChange(index)" :key="index"> {{item.label}} </div>
    </div>
    <div class="tabs-content">
        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 这里的value是为了可以使用v-model
    selected: {
      type: [String, Number]
    }
  },
  data: function() {
    return {
      // 因为不能修改value，所以复制一份自己维护
      currentValue: this.selected,
      navList: []
      // 用于渲染tabs的标题
    };
  },
  methods: {
    tabCls: function(item) {
      return [
        "tabs-tab",
        {
          // 给当前选中的tab加一个class
          "tabs-tab-active": item.name === this.currentValue
        }
      ];
    },
    getTabs(_this) {
      // 通过遍历子组件，得到所有的pane组件
      return this.$children.filter(function(item) {
        return item.$options.name === "pane";
      });
    },
    updateNav() {
      this.navList = [];
      // 设置对this的引用，在function回调里，this指向的并不是vue实例
      var _this = this;

      let arr = this.$children.filter(function(item) {
        return item.$options._componentTag === "pane";
      });

      // this.getTabs().forEach(function(pane,index){
      //   _this.navList.push({ label:pane.label, name:pane.name || index
      // });
      arr.forEach(function(pane, index) {
        _this.navList.push({ label: pane.label, name: pane.name || index });

        // 如果没有给pane设置那么，默认设置它的索引
        if (!pane.name) pane.name = index;
        // 设置当前选中的tab的索引
        if (index === 0) {
          if (!_this.currentValue) {
            _this.currentValue = pane.name || index;
          }
        }
      });

      this.updateStatus();
    },
    updateStatus() {
      let tabs = this.$children.filter(function(item) {
        return item.$options._componentTag === "pane";
      });
      // console.log(tabs);
      var _this = this;
      // 显示当前选中的tab对应的pane组件，隐藏没有选中的
      tabs.forEach(function(tab) {
        // console.log(tab.name === _this.currentValue);
        return (tab.show = tab.name === _this.currentValue);
      });
    },
    // 点击tab标题时触发
    handleChange: function(index) {
      // console.log(index)
      var nav = this.navList[index];
      var name = nav ? nav.name : '';
      // console.log(name);
      // 改变当前选中的tab，并触发下面的watch
      this.currentValue = name
    }
  },
  watch: {
    selected: function(val) {
      this.currentValue = val;
    },
    currentValue: function() {
      this.updateStatus();
    }
  }
};
</script>

<style <style lang="less" scoped>
.tabs-bar {
  display: flex;
}
.tabs-tab {
flex: 1;
height: 58px;
line-height: 58px;
background-color: rgba(212, 212, 212, 1);
color: rgba(13, 13, 13, 1);
font-size: 14px;
text-align: center;
font-family: Arial;
}
.tabs-tab-active {
background-color: rgba(77, 158, 237, 1);
color: rgba(255, 255, 255, 1);
}
</style>