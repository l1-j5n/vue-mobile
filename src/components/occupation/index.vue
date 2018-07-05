<!--
注意： 此处引用的所有内置组件，都必须要加上:inset="true"
所有自定义组件都需要满足以下要求：
1、props: ['formModel', 'name', 'inset']
2、使用innerValue存储组件的值(否则不兼容Mixin)
3、使用baseMixin，使组件行为一致，并自动把结果集成到formUnit

baseMixin 做了以下事情：
1. 挂载、更新组件值到innerValue
2. 基于innerValue验证组件状态
3. 向formUnit汇报组件状态

自定义组件怎么写：
1. 引入baseMixin,引入所需要的基本组件，如：zaInput,zaSelect.
2. 根据组件需求，定义innerValue。
   innerValue应该满足：
   - 与formModels.value格式相同（否则需要在自定义组件内写数据转换方法）
   - innerValue会直接被emit到外部（即innerModel.value）
   - 数据格式不限，但如果不是String或者Array, 则需要重写onValidate，以覆盖baseMixin中的验证方法
3. 处理内联组件的验证状态及数值绑定（@onChange/@formChange/@formEvent）
4. 如果需要自定义报错逻辑，可以重写__errorMsg方法
5. 根据需要定义其它局部变量，尽量有明显特征，不容易引起冲突。
6. innerValue/isValid/errorMsg等定义在baseMixin内的变量属于约定变量，请尽量沿用。
-->
<template>
    <row-2-col>
      <template slot="label">{{formModel.rules.label}}</template>
      <template slot="val">
        <div class="weui-cell_access">
	    	<div class="weui-cell__ft  vux-datetime-value" :value="innerValue" @click="getJob">
	          {{mapJob(innerValue)}}
	        </div>
        </div>
      </template>
    </row-2-col>
</template>

<script>
  import {row2Col, baseMixin} from 'vformer'
  export default {
    name: 'za-occupation',
    mixins: [baseMixin],
    props: ['formModel', 'name', 'index'],
    created() {
      window.testoc = this
      this.commit()
    },
    data(){
      return {
        innerValue: this.formModel.value
      }
    },
    methods: {
      mapJob(code){
      	let jobData = window.__occupationData
      	if(code && jobData[code]){
          return jobData[code]
      	}
      	return this.formModel.rules.placeholder
      },
      getJob(){
        if(this.formModel.rules.readOnly == true)
          return;
        console.log('getJob')
      // 用于开发环境mock数据
      if (process.env.NODE_ENV !== 'production'){
//        return this.innerValue = '201'
        return this.innerValue = '070106';
      }
	    window.getJob().then(success => {
	      const occupation = JSON.parse(success)
	      this.innerValue = occupation.code
	      this.$emit('occupationChange',occupation.code)
	    }, fail => {
	      console.log(fail)
	    }).catch(e => {
	      console.log(e)
	      throw new Error(e)
	    })
      }
    },
    components: {
      row2Col
    }
  }
</script>
