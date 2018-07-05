<!--
  这是一个demo
  用来演示formUnit如何使用，以及通过slot和baseMixin来扩展表单组件

  说明：form-unit
  name: 该字段为可选项，默认会生成一个随机id.
  formModels: 必填。接收一个配置文件，用来初始化表单。也可以先给空对象，再动态修改。
  formChange/formEvent 可选。用来处理回调
  性别：默认男，生日默认为1980-01-01
-->
<template>
  <div class="container" :class="{addusercustom:barrierOper}">
  	<za-title className="main-title" name="applicanttitle">
            投保人信息
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
        <!--{{getTitleIndex(index)}}-{{key}}-{{index}}-->
        <slot slot="icon" v-if="index!=0"><span @click="deleteInsurant(key)" class="icon_clear"></span></slot>
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
    // 注意：和 在线投保共用的方法在隔壁mixin.js
    submit(submitData){
      this.axios.post(CREATMOREINSUREPROPOSAL, submitData).then(({ data }) => {
        if (data.success) {
          let plans = data.value.content.planList
          const planId = plans[0].planId
          let query = {...this.$route.query, planId}
          delete query.insureId
          delete query.custId
          // 标记为是计划书入口进去的
          query.planType = 'sharePlan'
          // store 存储 被保人列表，下一步使用
          this.$router.push({name:'make-plan', query:query})
        }else{
          this.$vux.toast.show({ text: data.errorMsg });
        }
      });
    },
  }
};
</script>
<style lang='less' scoped>
@import "~@/assets/styles/page.less";
.container{
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

.addusercustom{
  overflow: hidden;
  padding-bottom: 0;
}
</style>
