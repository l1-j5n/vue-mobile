<template>
  <!-- 自定义tab组件 -->
  <div>
    <div class="tabs">

      <div class="tabs-bar">
        <div :class="tabCls(index, navList.length)" v-for="(item,index) in navList" @click="handleChange(index)" :key="index" v-waves>
          <p>{{item[label]}}</p>
        </div>
      </div>

      <div class="tabs-content">
        <pane :label="item[label]" :name="item.name" v-for="(item, index) in insurantList" :key="index">
          <!-- <div class="arrBox" v-for="(item2,subindex) in navList" :key="subindex">
            <div class="arrow" :class="{ active: currentValue == subindex }"></div>
          </div> -->
          <!-- <slot></slot> -->
        </pane>
      </div>

      <!-- <div class="arrowBox">
        <div class="arrBox" v-for="(item,index) in navList" :key="index">
          <div class="arrow" :class="{ active: currentValue == index }"></div>
        </div>
      </div> -->

    </div>





  </div>
</template>

<script>
// 导入自定义组件
import pane from "./pane";
import waves from 'src/directives/waves' // 水波纹指令
export default {
  props: {
    // tab的默认选项，0就是默认选第一个
    selected: {
      type: Number,
      default: 0
    },
    // 传入数据
    insurantList: {
      // 自定义验证函数
      validator: value => value.length <= 6,
      type: Array,
      required: true
    },
    // tab里面的名字的属性
    label: {
      type: String
    },
    // 设置true的话，就不可以切换其他tab,并且提示下面的那个msg信息
    disabled: {
      default: false
    },
    msg: {
      default: "不可以切换"
    }
  },
  directives: {
    waves
  },
  data: function() {
    return {
      // 因为不能修改value，所以复制一份自己维护
      currentValue: this.selected,
      navList: [],
      tabIndex: 0
      // 用于渲染tabs的标题
    };
  },
  methods: {
    tabCls: function(index, len) {
      return [
        "tabs-tab",
        {
          "tabs-tab_3": len <= 3,
          "tabs-tab_4": len > 3,
          // 给当前选中的tab加一个class
          "tabs-tab-active_3": index === this.currentValue && len <= 3,
          "tabs-tab-active_4": index === this.currentValue && len > 3
        }
      ];
    },
    // arrowCls: function(item) {
    //   console.log(item === this.currentValue)
    //   return [
    //     "arrow",
    //     {
    //       // 给当前选中的arrow加一个class
    //       "arrow-active": item === this.currentValue
    //     }
    //   ];
    // },
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
        // if (!pane.name) pane.name = index;
        // 设置当前选中的tab的索引
        // if (index === 0) {
        //   if (!_this.currentValue) {
        //     _this.currentValue = pane.name || index;
        //   }
        // }
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
      this.tabIndex = index;
      let callbackData = this.insurantList[index];
      this.$emit("beforeSelect", index, callbackData);

      this.$nextTick(() => {
        this.$nextTick(() => {
          if (this.disabled && this.currentValue !== index) {
            this.$vux.toast.show({ text: this.msg });
            return;
          }
          // console.log(index)
          var nav = this.navList[index];
          // var name = nav ? nav.name : '';
          // console.log(name);
          // 改变当前选中的tab，并触发下面的watch
          this.currentValue = index;
          this.$emit("onSelect", index, callbackData);
        });
      });
    }
  },
  watch: {
    selected: function(val) {
      this.currentValue = val;
      this.handleChange(val)
    },
    currentValue: function() {
      this.updateStatus();
    },
    disabled: function(val) {
      this.handleChange(this.tabIndex);
    }
  },
  components: {
    pane
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/styles/page.less";
@W: 120/2px;
@H: 120/2px;
.tabs-bar {
  box-sizing: border-box;
  -webkit-display: flex;
  display: flex;
  -webkit-justify-content: space-evenly;
  justify-content: space-evenly;
  align-items: center;
  .tabs-tab {
    background-size: 100% 100%;
    background-color: @weuiBgColorTab;
    & > p {
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 70%;
    }
  }
  .tabs-tab_3 {
    display: inline-block;
    width: @W;
    height: @H;
    border-radius: @H;
    font-size: 12px;
    text-align: center;
    box-sizing: border-box;
    // transition: all 0.6s;
  }
  .tabs-tab_4 {
    display: inline-block;
    width: 100/2px;
    height: 100/2px;
    border-radius: 100/2px;
    font-size: 10px;
    text-align: center;
    box-sizing: border-box;
    // transition: all 0.6s;
  }
  .tabs-tab-active_3 {
    width: 138/2px;
    height: 150/2px;
    background: url(~@/assets/styles/images/tab_3.png);
    background-size: 100% 100%;
    color: rgba(255, 255, 255, 1);
    & > p {
      width: 80%;
    }
  }
  .tabs-tab-active_4 {
    width: 114/2px;
    height: 123/2px;
    background: url(~@/assets/styles/images/tab_4.png);
    background-size: 100% 100%;
    color: rgba(255, 255, 255, 1);
    & > p {
      width: 80%;
    }
  }
}
</style>

