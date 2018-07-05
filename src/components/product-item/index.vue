<!-- 说明：product-item
 @Author: jankergg
 @Date:   2018-05-12 11:13:40
 @Last Modified by:   jankergg
 @Last Modified time: 2018-05-12 12:06:40
 @desc 这是产品原型组件，用于完整的展现单个保险产品, 被 制作保险计划，制作计划书 模块引用
 -->
<template>
  <div class="product-unit">
    <!-- 主险只有一条 -->
    <product-unit :product="product" :name="product.productId" @onSyncData="onSyncData" @onRemove="onRemovePro" @update="mainUpdate"></product-unit>
    <!-- 主险 -->

    <!-- 附加险 可以有很多条 -->
    <product-unit :product="riderProduct" :name="product.productId" v-for="(riderProduct, index) in product.riderList" :key="index"
    @onRemove="onRemovePro" @onSyncData="onSyncData"></product-unit>
    <!-- 附加险 可以有很多条 -->

    <div class="product-item product-add">
      &nbsp;&nbsp;保费小计：<span class="Premium">{{insureMoney}}</span>&nbsp;元
    </div>
    <!-- 此处判断，当前险种可选附加险的时候，并且试算完成（amount_value>0）才显示附加险 -->
    <div class="product-item product-add">
      <div class="left_btn" v-if="shouldAddRider">
        <div class="btn_box">
          <button class="weui-btn weui-btn_plain-primary" @click="addAttach">添加附险</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productUnit from './product'
export default {
  name: "product-item",
  data() {
    return {
      formCollection: {},
      shouldAddRider: this.product.hasRider && this.product.amount_value>0
    };
  },
  mounted() {
    // 将当前表单挂载到父结点
    this.$nextTick(() => {
      this.$emit("onInit", this.formCollection);
    });
  },
  props: {
    insureMoney: [String,Number],
    product: {
      type: Object,
      required: true
    },
    name: String
  },
  methods: {
    onRemovePro(e, product){
      this.$emit('onRemove', e, product)
    },
    onSyncData(data){
      this.$emit('onSyncData', data)
    },
    mainUpdate(v){
      this.shouldAddRider = v.hasRider && v.amount_value>0
    },
    addAttach() {
      const selectedRider = this.product.riderList.map(prod => prod.productId)
      this.$emit("onAddRider", "rider", this.product.productId, selectedRider)
    },
    formInit(v) {
      this.formCollection[v.name] = v;
    }
  },
  components: {
    productUnit
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/styles/page.less";
.product-add {
  margin: 10px 0;
}
</style>
