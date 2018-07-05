<!--
  说明：form-unit
  name: 该字段为可选项，默认会生成一个随机id.
  formModels: 必填。接收一个配置文件，用来初始化表单。也可以先给空对象，再动态修改。
  formChange/formEvent 可选。用来处理回调
-->
<template>
  <div class="container"  :class="{einsureaddusercustom:barrierOper}">
    <za-title className="main-title" name="applicanttitle" >
            投保人信息
      <slot slot="icon" >
        <span @click="importInfo('app')" class="icon-import-blue-font"></span>
        <span @click="scanInfo('app')" class="icon-scan-blue-font"></span>
        <span @click="clearInfo('app')" class="icon-clear-font"></span>
      </slot>
    </za-title>
    <form-unit name="applicant"
      :formModels="applicantData"
      @formEvent="applicantChange"
      @onInit="formUnitInit" >
      <template slot="occupation">
        <za-occupation :formModel="applicantData.occupation" name="occupation" @occupationChange="occupationChange"></za-occupation>
      </template>
    </form-unit>
  <div v-for="(ins, key, index) of insList" :key="index">
    <za-title className="main-title" v-if="ins">
      {{getTitleIndex(index)}}
      <!--{{getTitleIndex(index)}}-{{selselfFlag}}-{{index}}-->
      <slot slot="icon" v-if="index==0 && selselfFlag==true">
      </slot>
      <slot slot="icon" v-else-if="index==0 && selselfFlag==false">
        <span @click="importInfo('ins',key)" class="icon-import-blue-font"></span>
        <span @click="scanInfo('ins',key)" class="icon-scan-blue-font"></span>
        <span @click="clearInfo('ins',key)" class="icon-clear-font"></span>
      </slot>
      <slot slot="icon" v-else >
        <span @click="importInfo('ins',key)" class="icon-import-blue-font"></span>
        <span @click="scanInfo('ins',key)" class="icon-scan-blue-font"></span>
        <span @click="clearInfo('ins',key)" class="icon-clear-font"></span>
        <span @click="deleteInsurant(key)" class="icon-delete-font"></span>
      </slot>
    </za-title>
    <form-unit v-if="index==0"
      :name="'ins'+key"
      @formEvent="insurantChange"
      @onInit="formUnitInit"
      :formModels="ins">
      <template slot="occupation">
        <za-occupation :formModel="ins.occupation" name="occupation"></za-occupation>
      </template>
    </form-unit>
    <form-unit v-else
      :name="'ins'+key"
      @onInit="formUnitInit"
      @formEvent="subInsurantChange"
      :formModels="ins">
      <template slot="occupation">
        <za-occupation :formModel="ins.occupation" name="occupation"></za-occupation>
      </template>
    </form-unit>
  </div>
<div class="btn-container">
 <div @click="addIns" class="btn-add">
  <span class="icon-add-blue"></span>
  <span>添加被保人</span>
</div>
</div>
<div @click="nextStep" class="btn-next"> 下一步</div>

    <div v-if="barrierOper" ref="barrier" @click="barrierOperTip" class="einsure-operation-mask"></div>
</div>


</template>

<script>
// 导入配置文件
import {mapActions} from 'vuex'
import store, {ACTION} from 'src/store'
import commonMethods from '../mixin'
import { formUnit, zaInput, zaSelect, zaTitle } from "vformer";
// 导入formUnit
import zaOccupation from "@/components/occupation"
import { LOADPROPOSAL, CURRENTTIME, CREATMOREINSUREPROPOSAL, GETCUSTM } from "@/api";
export default {
  mixins: [commonMethods],
  created() {
    window.test = this;
    this.getCurrentTime()
  },
  methods: {
    // 注意：和 计划书共用的方法在隔壁mixin.js
    /**
     * 根据传入对象将数据map到页面
     * type--标识投被保人,insIndex--被保人索引,result--将要map进页面的值
     * result--传入的map数据对象
     */
    mapDataToDom(type,insIndex,result){
      let success = result
      if(type === 'app'){
        let applicantData = this.__deepCopy(this.applicantData)
        Object.keys(applicantData).map((key) => {
//          if(success.hasOwnProperty(key)) {
            applicantData[key].value = success[key]
//          }
        })
        // 关系为本人时填充被保人
        let insOne = this.__deepCopy(this.formCollection['ins0']['formValues'])
        let insZero = this.__deepCopy(this.insList[0])
        if(insOne.relation === '00'){
          Object.keys(insZero).map((key) => {
            if(key === 'relation'){
//              if(insOne.hasOwnProperty(key)) {
                insZero[key].value = insOne[key]
//              }
            }else{
//              if(success.hasOwnProperty(key)) {
                insZero[key].value = success[key]
//              }
            }
          })
          this.insList[0] = insZero
        }
        this.applicantData = applicantData
      }else if(type === 'ins'){
        //导入被保人
        let insData = this.__deepCopy(this.insList[insIndex])
        Object.keys(insData).map((key) => {
          if(success.hasOwnProperty(key) && success[key]!='' && success[key]!=null){
            insData[key].value = success[key]
          }
//          insData[key].value = success[key]
        })
        this.insList[insIndex] = insData
      }
    },
    /**
     * 导入投被保人信息
     */
    importInfo(type,insIndex){
      window.getCustomer().then(result => {
        let succ = JSON.parse(result)
        this.mapDataToDom(type,insIndex,succ)
      }, fail => {
      }).catch(e => {
        throw new Error(e)
      })
    },
    /**
     * 扫描投被保人信息
     */
    scanInfo(type,insIndex){
      window.idCardScan().then(result => {
        let succ = JSON.parse(result)
        this.mapDataToDom(type,insIndex,succ)
      }, fail => {
      }).catch(e => {
        throw new Error(e)
      })
    },
    /**
     * 清空投保人信息
     */
    clearInfo(type,insIndex){
      let result = {name:'',genderCode:'M',birthday:'1980-01-01',occupation:'',relation:'',relationFristInsure:''}
      this.mapDataToDom(type,insIndex,result)
    },
    submit(submitData){
      this.axios.post(CREATMOREINSUREPROPOSAL, submitData).then(({ data }) => {
        if (data.success) {
          let plans = data.value.content.planList
          const planId = plans[0].planId
          let query = {...this.$route.query, planId}
          delete query.insureId
          delete query.custId
          // 动态的下一步
          store.dispatch(ACTION.GET_ROUTE_NEXT, {planId, route: this.$route}).then(nextRoute => {
            this.$router.push({...nextRoute, query})
          })
        }else{
          this.$vux.toast.show({ text: data.errorMsg });
        }
      });
    }
  },
};
</script>
<style lang='less' >
@import "../../../../assets/styles/page.less";
.container{

  .test{
    background-color: red;
  }

  padding-bottom: 60px;
  background-color:@bgGray;
  .btn-container{
    background-color:@bgGray;
    padding-top:20px;
    padding-bottom: 60px;
    .btn-add{
      color: @btnBlue;
      font-size: 17px;
      background-color:@white;
      text-align: center;
      display: block;
      padding-top:30px;
      padding-bottom: 30px;
      border:1px solid @white;
      .icon-add-blue{
        margin-right:2px;
      }
    }
  }
  .form-title{
    .icon{
      flex: 2;
      span{
        margin-left: 2%;
        width:20%;
      }
    }
  }

  .einsure-operation-mask{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 210px;
    opacity: 0.1;
    -webkit-transition: opacity 0.1s ease;
    transition: opacity 0.1s ease;
    background-color: #000;
    z-index: 999;
  }

}

.einsureaddusercustom{
  overflow: hidden;
  padding-bottom: 0;
}
</style>
