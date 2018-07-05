<!-- 说明：product-item
 @Author: jankergg
 @Date:   2018-05-12 11:13:40
 @Last Modified by:   jankergg
 @Last Modified time: 2018-05-12 12:06:40
 @desc 这是产品原型组件，用于完整的展现单个保险产品, 被 制作保险计划，制作计划书 模块引用
 -->
<template>
  <div class="product-item" :class="{'attach-ins':product.isRider}">
    <div class="space-between title">
      <div class="left weui-cell">
        <span class="isMain" :class="{'isRider':product.isRider}"></span> &nbsp; {{product.abbrName}}</div>
        <div class="right">
          <span @click="$emit('onRemove',$event, product)"><span class="del"></span>删除</span>
        </div>
      </div>
      <form-unit :name="name" v-if="formModel" :formModels="formModel" @formEvent="onSetChange" @onInit="formInit"></form-unit>
      <!-- 只有是主险的时候才显示金额 -->
      <div class="weui-cell__ft">
        <div class="totalprice">保费: &nbsp;<span class="Premium">{{premium}}元</span></div>
      </div>
    </div>
</template>

<script>
// 导入formUnit
import { formUnit } from "vformer";
import { SETPRODUCT } from "@/api";
export default {
  name: "product-unit",
  data() {
    return {
      premium: '',
      formModel: null
    };
  },
  mounted() {
    window.pp = this
    this.setData(this.product);
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    name: String
  },
  watch: {
    product(v) {
      this.setData(v);
    }
  },
  methods: {
    // 当手动修改数据
    onSetChange(type, value, key) {
      this.setRuler(key, value.value).then(res => {
        this.setProduct().then(({ data }) => {
          if (data.success){
            const ct = data.value.content
            let { productId } = this.product
            let _product = ct.insurants[0].productList.find(
              i => i.productId === productId
            )
            // 必须，强制从接口再更新
            this.setData(_product)
            this.$emit("onSyncData", data)
            if (ct.ruleList.length){
              this.__toast(ct.ruleList[0])
            }
          } else {
            this.__toast(data.errorMsg)
          }
        })
      })
    },
    // 这里是产品联动规则
    setRuler(key, value){
      const self = this
      return new Promise((resolve, reject) => {
        let newModel = self.__clone(self.formModel)
        // 因为formModel此时不是最新的，所以要从formValues更新下
        let formValues = self.getForm(self.name).formValues
        formValues[key]=value
        this.__mapPropsToModel(newModel, formValues).then(model => {
          switch(key){
            case 'pay_freq':
              if (value[0] === 'single'){
                model['pay'].value = 'single'
              }
              if (value[0] === 'year'){
                model['pay'].value = 'term_5'
                model['pay'].rules.options[0][0] = {value:'term_5',name: '5年期'}
              }
            break;
          }
          self.formModel = model
          self.$nextTick(() => {
            resolve(model)
          })
        })
      }).catch(e => {
        return false
      })
    },
    // 从factors 抽取formModels
    setData(data) {
      const model = this.getModelsFromFactor(data["factors"]);
      if (model) {
        // 强制重绘formUnit
        this.formModel = null;
        this.$nextTick(() => {
          this.formModel = model;
        });
      }
      this.$emit('update', data)
      this.premium = data.premium || "";
    },
    // 同步修改后的数据
    setProduct() {
      const { insureId, planId } = this.$route.query;
      const { productId, parentId, commodityId } = this.product;
      let params = { insureId, productId, planId, commodityId };
      // 如果是附加险，就要带上父险ID
      if (parentId) {
        params.parentId = parentId;
      }
      // 表单数据
      let form = this.getForm(this.name)
      Object.assign(params, form.formValues);
      return this.axios.post(SETPRODUCT, params);
    },
    getModelsFromFactor(factors = []) {
      let model = {};
      factors.map(item => {
        let $item = (model[item.key] = {
          value: item.value,
          rules: {
            type: "za-" + item.type,
            label: item.title
          }
        });
        switch (item.type){
          case "text":
            // text 类型
            $item.rules.type = 'za-input';
            $item.rules.readOnly = true;
          break;
          case "select":
            // select 类型
            const sloption = item.list.map(ops => ({
              name: ops.text,
              value: ops.code
            }));
            $item.rules.showName = true;
            $item.rules.options = [sloption];
          break;
          case "input":
            // input 类型
            $item.rules.event = "change";
            $item.rules.extra = { text: "元" };
            $item.rules.filter = /\.(.+)?$/;
            $item.rules.vRules = "required|minnum:3";
          break;
          case "button_group":
            // button_group 类型
            const bg_option = item.list.map(ops => ({
              name: ops.text,
              value: ops.code
            }));
            $item.rules.options = [bg_option];
        }
      });
      return model;
    },
    formInit(v) {
      this.$emit('onInit', v)
    }
  },
  components: {
    formUnit
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/styles/page.less";
.product-item {
  background: @weuiBgColorPlain;
  border: 0;
  border-radius: 5px;
  .weui-cell__ft {
    text-align: right;
    background: @weuiBgColorPlain;
    // color: @weuiColorPrimaryLight;
    padding: 10px 15px;
    .left_btn {
      width: 48%;
      display: inline-block;
      text-align: left;
    }
    .totalprice {
      display: inline-block;
      width: 50%;
      vertical-align: middle;
    }
  }

  .plan-detail {
    .form-title,
    .weui-cell__ft {
      background: @weuiBgColorPlain;
    }
  }
  .isMain {
    width: 24px;
    height: 24px;
    background: url(~@/assets/styles/images/isMain.png);
    background-size: 100%;
  }
  .isRider {
    width: 24px;
    height: 24px;
    background: url(~@/assets/styles/images/isRider.png);
    background-size: 100%;
  }
  .right {
    padding: 10px 15px;
    &>span{
      display: flex;
      align-items: center;

      .del {
        display: inline-block;
        width: 63/3px;
        height: 63/3px;
        margin-right: 5px;
        background: url(~@/assets/styles/images/delete.png);
        background-size: 100%;
      }
    }
  }
  .title:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  &.attach-ins {
    margin-top:10px;
    .title{
      background:#f5f3d7;
    }
    /deep/ .form-title,
    .weui-cell__ft {
      background: @weuiBgColorHighlight;
    }
    /deep/ .weui-cells {
      background: @weuiBgColorHighlight;
    }
  }
}
.product-add {
  margin: 10px 0;
}
</style>
