<template>
  <div class="container bene-Info">
    <za-title className="main-title" >
            受益人信息
      <slot slot="icon" >
      	<span @click="importInfo" class="icon-import-blue-font"></span>
    		<span @click="scanInfo" class="icon-scan-blue-font"></span>
      </slot>
    </za-title>
    <form-unit name="benificiary" :formModels="formModel" @formChange="onChange" @formEvent="onEvent">
      <template slot="certValidity">
	       <div class="weui-cell row2col">
          <span class="weui-label">有效期至</span>
          <za-date :formModel="formModel.certValidity" name="certValidity" class="validate">
          </za-date>
          <div class="long-box">
            <label for="sameappl" class="long-time">
              <input type="checkbox" class="weui-check" id="sameappl" @change="longTime" name="check" v-model="checked">
              <i class="icon-checked"></i>
              <span class="long-txt">长期</span>
            </label>
          </div>
        </div>
	    </template>
    </form-unit>
    <!-- <div @click="test">测试</div> -->
    <div class="button-wrapper">
      <div class="btn-next" @click="nextStep">下一步</div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { formUnit, Tab, TabItem, zaTitle, zaDate} from 'vformer'
  // 导入配置文件
  import modelData from './formModel'
  import {SAVEASSIGNBEBEFICTORY, BENEFICIARCUSTUMER, SAVEBENEFICTARY, UPDATEBENEFICTARY, QUERYINSURANT, GET_CITIZENSHIP_LIST} from '@/api'
  import * as ValidateRules from "@/widget/validate/myextends"
  import {getBirthday, getSex, getAge} from '@/widget/util/index'
  import {lingageChecke} from "../../check"
  export default {
    name: 'beneficiary-info',
    data() {
      return {
        formModel: modelData,
        loadApply: {},
        applyId: '',
        planId: '',
        custId: '',
        insureSeq: '',
        benefictaryType: '',
        benefictaryCustomer: {},
        citizenship: [],
        validte: '',
        checked: false,
        testdata: '',
        count:0,
        idcardorpass: false
      }
    },
    created(){
      this.getVlidate()
      window.test = this;
      let query = this.$route.query;
      this.applyId = query.applyId;
      this.planId = query.planId;
      this.custId = query.custId || '';
      this.insureSeq = query.insureSeq || '';
      this.benefictaryType = query.benefictaryType || '';
      this.getCitizenship().then(()=> {
          if (this.insureSeq && this.custId) {
            this.queryBenefictaryCustomer();
          }
      })
    },
    mounted() {
    },
    methods: {
      getVlidate(){
        this.$nextTick(()=> {
          test.getForm('benificiary')
          var f = test.getForm('benificiary')
          this.validte = f.__proto__.formValidator.dictionary.dictionary.cn.messages;
           //添加扩展验证规则
          for (let i in ValidateRules) {
            if (ValidateRules[i].messages && ValidateRules[i].validate){
              try {
                f.__proto__.formValidator.extend(i, ValidateRules[i]);
              } catch (e) {
                console.log(e)
              }
            }
          }
        })

      },
       // 有效期为长期
      longTime(e){
        console.log(e.target.checked);
        // if (e.target.checked) {
          let newModel = this.__clone(this.formModel);
          let benificiary = this.getForm("benificiary").formValues;
          this.__setModel(newModel, benificiary).then(res => {
            Object.keys(res).map(key => {
              if(key === "certValidity"){
                if(e.target.checked){
                  res[key].value = "9999-01-01";
                }else{
                  if(res[key].value = "9999-01-01"){
                    res[key].value = "";
                  }
                }
              }
            })
            return res
          }).then(res=>{
            this.formModel= res
          })
        // }
      },
      onEvent(t, v, name) {
        console.warn(t, `这次更新是由${name}触发的`, v)
        console.warn(t, `这次更新是由${name}触发的`, v)
        this.$nextTick(() => {
          if (name === "certType" ||  name === "certValidity") {
              let newModel = this.__clone(this.formModel);
              let benificiary = Object.assign(this.getForm('benificiary').formValues)
              Object.keys(newModel).map(key => {
                if(name === 'certType'){
                  if(key === "certNo"){
                    if(v.value[0] === '01'){
                      newModel[key].rules.vRules = "required|idcard"
                      // benificiary ["citizenship"] = "CHN"
                      // newModel["citizenship"].rules.readOnly = true
                    }
                    else if(v.value[0] === 'A'){
                      newModel["citizenship"].rules.readOnly = false
                      newModel[key].rules.vRules = "required|passport"
                    }
                    else if(v.value[0] === '10'){
                      newModel["citizenship"].rules.readOnly = false
                      newModel[key].rules.vRules = "required|taipassport"
                    }
                    else if(v.value[0] === '11'){
                      newModel["citizenship"].rules.readOnly = false
                      newModel[key].rules.vRules = "required|reentrypermit"
                    }
                    else if(v.value[0] === '12'){
                      newModel["citizenship"].rules.readOnly = false
                      newModel[key].rules.vRules = "required|birthcertificate"
                    }
                    else if(v.value[0] === '02'){
                      newModel["citizenship"].rules.readOnly = false
                      newModel[key].rules.vRules = "required|register"
                    }
                    else{
                      newModel["citizenship"].rules.readOnly = false
                      newModel[key].rules.vRules = 'required'
                    }
                  }
                  // this.idcardorpass = v.value[0] === "01" || v.value[0] === "A" || v.value[0] === "10"
                  // if(v.value[0] !== "01" || v.value[0] !== "A" || v.value[0] !== "10"){
                  //   if(newModel["certValidity"].value == "9999-01-01"){
                  //     newModel["certValidity"].value == ""
                  //     benificiary["certValidity"] = ""
                  //     this.checked = false
                  //   }
                  // }
                }
                else if(name === "certValidity" && v.value !== "9999-01-01"){
                  this.checked = false
                }
                 newModel[key].value = benificiary[key];
              });
                 this.formModel = newModel;
            }
        });
      },
      onChange(v, name) {
        console.log('trigger: formChange::', v, name)
      },
      //获取国籍
      getCitizenship(){
         return this.axios.get(GET_CITIZENSHIP_LIST)
          .then(({data}) => {
            if(!data.success) {
              this.__toast(data.errorMsg);
              return Promise.reject(errorMsg);
            }
            this.citizenship = [data.value.dictItemList.map(item => {
              return {
                value: item.code,
                name: item.desc
              }
            })]
            Object.keys(this.formModel).map(key => {
              if(key === "citizenship"){
                this.formModel["citizenship"].rules.options = this.citizenship;
              }
            })

            return Promise.resolve()
          })
      },
      queryBenefictaryCustomer() {
        this.axios.post(QUERYINSURANT, {'applyId': this.applyId})
        .then(({data})=>{
          if (data.success){
            // this.testdata = data.value[0].benefictaryDTO.benefictaryCustomerDTOList;
            data.value.forEach((item)=>{
              if (item.insureSeq == this.insureSeq) {
                this.benefictaryCustomer = item.benefictaryDTO.benefictaryCustomerDTOList.find(item => item.custId == this.custId)
              }
            })
            if(this.benefictaryCustomer["certValidity"]==="9999-01-01"){
              this.checked = true;
            }

            this.getConfiginfo(this.benefictaryCustomer);
          } else {
            this.$vux.toast.show({
              text: data.errorMsg
            })
          }
        })
        .catch((err) =>{
          console.log(err);
        })
      },
      getConfiginfo(data) {
        // if(data.certValidity ==="9999-01-01"){
        //     this.checked = true;
        // } else {
        //   this.checked = false;
        // }
        this.checked = data.certValidity ==="9999-01-01"
        let model = JSON.parse(JSON.stringify(modelData));
        this.__setModel(model, data).then(res => {
          res.benefitOrder.value = res.benefitOrder.value + ''
          res.benefitRatio.value = res.benefitRatio.value + ''
          Object.keys(res).map(key => { 
            if(key === 'certNo') {
              if(data.certType === '01'){
                  res[key].rules.vRules = "required|idcard"
              }
              else if(data.certType === 'A'){
                  res[key].rules.vRules = "required|passport"
              }
              else if(data.certType === '10'){
                  res[key].rules.vRules = "required|taipassport"
              }
              else if(data.certType === '11'){
                  res[key].rules.vRules = "required|reentrypermit"
              }
              else if(data.certType === '12'){
                  res[key].rules.vRules = "required|birthcertificate"
              }
              else if(data.certType === '02'){
                  res[key].rules.vRules = "required|register"
              }
              else{
                  res[key].rules.vRules = 'required'
              }
            }
          })
          return res
        }).then(res =>{
          this.formModel = res;
        })
      },
      nextStep() {
        let fm = this.getForm('benificiary');
        let benificiary = fm.formValues;
        fm.validateAll().then(res=>{
          if (res === true) {
            if(!lingageChecke(benificiary)){
              return false
            }
            benificiary = Object.assign(this.benefictaryCustomer, benificiary)
            this.submitData(benificiary)
          } else {
              this.$vux.toast.show({
                text: fm.getErrorMsg()
              })
          }
        })
      },
      test(){
        this.count = this.count + 1
        console.log(this.testdata)
        if(this.count/2==1){
          this.getConfiginfo(this.testdata[0])
        }else {
           this.getConfiginfo(this.testdata[1])
        }
      },
        /**
       * 导入受益人人信息
       */
      importInfo(){
        window.getCustomer().then(result => {
          let succ = JSON.parse(result)
          this.getConfiginfo(succ)
        }, fail => {
        }).catch(e => {
          throw new Error(e)
        })
      },
      /**
       * 扫描受益人人信息
       */
      scanInfo(type,insIndex){
        window.idCardScan().then(result => {
          let data = JSON.parse(result)
          this.getConfiginfo(data)
        }, fail => {
        }).catch(e => {
          throw new Error(e)
        })
      },
      submitData(benificiary) {
        this.axios.post(SAVEASSIGNBEBEFICTORY, {benefictaryCustomer:benificiary, applyId: this.applyId, insureSeq: this.insureSeq, benefictaryType: this.benefictaryType,
         custId:this.custId})
          .then(({data}) => {
            if (data.success) {
              this.$router.push({path: 'beneficiary-list', query:{applyId: this.applyId, planId: this.planId}})
            } else {
              this.$vux.toast.show({
                text:data.errorMsg
              })
            }
          })
          .catch((err) => {
            console.log(err);
          }) 
      },
      valibenefitRatio(value){
        // debugger
        // ^(([1-9]\d?)|100)$
        // "^(\d|[1-9]\d|100)$"
        // 包括小数的/^(100|[1-9]?\d(\.\d\d?\d?)?)$/
        let reg = new RegExp(/^(([1-9]\d?)|100)$/)
        if(reg.test(value)){
          return true
        }else{
          return false
        }
      }
    },
    components: {
      formUnit,
      Tab,
      TabItem,
      zaTitle,
      zaDate
    }
  }
</script>

<style lang='less' scoped>
  @import "../../../../assets/styles/page.less";
  .bene-Info{
    .button-wrapper {
      margin-top: 24px;
      margin-bottom: 25px;
      text-align: center;
      .next {
        width: 350px;
        height: 46px;
      }
    }
    .validate{
      width: 100%;
    }
    .long-box{
      width: 24%;
    }
    .long-time{
      display: flex;
      .long-txt{
        color: @btnBlue;
         width: 65%;
        text-align: right;
      }
    }
  }
</style>

