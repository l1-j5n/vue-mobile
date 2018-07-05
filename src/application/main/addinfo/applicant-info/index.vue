<!--完善信息-->
<template>
  <div class="container applicant-info">
    <tab bar-active-color="#5697ff">
      <tab-item selected>投保人信息</tab-item>
      <tab-item disabled>被保人信息</tab-item>
    </tab>
    <form-unit name="applicantInfo" :formModels="formModel" @formChange="onChange" @formEvent="onEvent">
    <!--<form-unit name="applicantInfo" :formModels="formModel"  >-->
      <template slot="occupation">
	      <za-occupation :formModel="formModel.occupation" name="occupation"></za-occupation>
	    </template>
      <template slot="certValidity">
	       <div class="weui-cell row2col">
          <span class="weui-label">有效期至</span>
          <za-date :formModel="formModel.certValidity" name="certValidity" class="validate">
          </za-date>
          <div class="long-box">
            <label for="longTime" class="long-time">
              <input type="checkbox" class="weui-check" id="longTime" @change="longTime" name="check" v-model="checked">
              <i class="icon-checked"></i>
              <span class="long-txt">长期</span>
            </label>
          </div>
        </div>
	    </template>
    </form-unit>
    <div class="button-wrapper">
      <div class="btn-next" @click="nextStep">下一步</div>
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'
  import { formUnit, Tab, TabItem, zaDate} from 'vformer'
  import modelData from './formModel'
  import {LOADAPPLY, SAVEAPPLIANTADDINSURANT, LOADAPPLYWITHMULTIINSURANTS, GET_CITIZENSHIP_LIST} from '@/api'
  import zaOccupation from "@/components/occupation"
  import * as ValidateRules from "@/widget/validate/myextends"
  import {getBirthday, getSex, getAge} from '@/widget/util/index'
  import {lingageChecke} from "../../check"
  export default {
    name: 'applicant-info',
    data() {
      return {
        formModel: modelData,
        // defaultModel: JSON.stringify(modelData),
        loadApply: {},
        citizenship: [],
        checked: false,
        validte: '',
        idcardorpass: false,
        initialComplete:false
      }
    },
    created() {
      window.test = this;
      this.planId = this.$route.query.planId;
      this.getVlidate()
      this.getCitizenship().then(()=> {
          this.getloadApply(this.planId);
      })
    },
    methods: {
      // 获取校验
      getVlidate(){
        this.$nextTick(()=> {
          test.getForm('applicantInfo')
          var f = test.getForm('applicantInfo')
          //添加扩展验证规则
          for (let i in ValidateRules) {
            if (ValidateRules[i].messages && ValidateRules[i].validate){
              try {
                f.__proto__.formValidator.extend(i, ValidateRules[i]);
                // formValidator.extend(i, ValidateRules[i])
                console.log(ValidateRules)
              } catch (e) {
                console.log(e)
              }
            }
          }
          this.validte = f.__proto__.formValidator.dictionary.dictionary.cn.messages;
        })
      },
      // 获取国籍数据
      getCitizenship(){
        return this.axios.get(GET_CITIZENSHIP_LIST)
          .then(({data}) => {
            if(!data.success) {
              this.__toast(data.errorMsg)
              return Promise.reject(data.errorMsg);
            }
            // 国籍
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
        // 证件有效期为长期
      longTime(e){
        console.log(e.target.checked);
        // if (e.target.checked) {
          let newModel = this.__clone(this.formModel);
          let applicantInfo = this.getForm("applicantInfo").formValues;
          this.__setModel(newModel, applicantInfo).then(res => {
            Object.keys(res).map(key => {
              if(key === "certValidity"){
                // res[key].value = "9999-01-01";
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
        // 联动校验
        console.warn(t, `这次更新是由${name}触发的`, v)


        this.$nextTick(() => {
          if (name === "certType"||
              name === "certValidity") {
              let newModel = this.__clone(this.formModel);
              let applicant = Object.assign(this.getForm('applicantInfo').formValues)
              Object.keys(newModel).map(key => {
                // if((name === "isNeedPaperPolicy") && key === "email"){
                //   if(v.value === "N"){
                //       newModel[key].rules.vRules = "required|email|isFullWidth|max:50";
                //   } else {
                //       newModel[key].rules.vRules = "";
                //   }
                // }
                if(name === 'certType'){
                  if(key === "certNo"){
                    if(v.value[0] === '01'){
                      newModel[key].rules.vRules = "required|idcard"
                      // applicant["citizenship"] = "CHN"
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
                  // if(key === "certValidity"){
                  //   if(v.value[0] === "01" || v.value[0] === "A" || v.value[0] === "10"||v.value[0] === "11"){
                  //     newModel[key].rules.vRules = "required"
                  //   } else{
                  //     newModel[key].rules.vRules = ""
                  //   }
                  // }

                }
                else if(name === "certValidity" && v.value !== "9999-01-01"){
                  this.checked = false
                }
                newModel[key].value = applicant[key];
              });
                this.formModel = newModel;
            }
        });
      },
      onChange(v, name) {
        console.log('trigger: formChange::', v, name)

      },
      getloadApply(planId) {
        this.axios.post(LOADAPPLYWITHMULTIINSURANTS,{planId: planId})
        .then(({data}) => {
          if (data.success) {
            this.loadApply = data.value;
            let applicant = this.loadApply.applicant;
            if(applicant["certValidity"]==="9999-01-01"){
              this.checked = true;
            }
            if(applicant.citizenship == ""){
              applicant.citizenship = 'CHN'
            }
            this.getConfiginfo(applicant)

//            this.getForm('applicantInfo').$on('formChange',(v,name)=>{
//              alert()
//            });
//            this.getForm('applicantInfo').$on('formEvent',(v,name)=>{
//              alert()
//            });

          } else {
             this.__toast(data.errorMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        })
      },
      // 回显
      getConfiginfo(data) {
        let model = JSON.parse(JSON.stringify(modelData))
        this.__setModel(model, data).then(res => {
          Object.keys(res).map(key => {
            if ((key==="relation"&&res.relation) ||
                (key==="name"&&res.name) ||
                (key==="birthday"&&res.birthday) ||
                (key==="genderCode"&&res.genderCode)){
              res[key].rules.readOnly = true
            }
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
                  model[key].rules.vRules = 'required'
              }
            }
            // else if(key === "email") {
            //   if(data.isNeedPaperPolicy === "N"){
            //       model[key].rules.vRules = "required|email|isFullWidth|max:50";
            //   } else {
            //       model[key].rules.vRules = "";
            //   }
            // }
          })
          return res
        }).then(res=>{
          this.formModel= res
        })
      },
      nextStep() {
        let fm = this.getForm('applicantInfo');
        let applicant = fm.formValues;
        let updateloadApply = {};
        fm.validateAll().then(res=>{
          if (res === true) {
            if(lingageChecke(applicant)){
               updateloadApply = Object.assign(this.loadApply, {applicant}, {isNeedPaperPolicy: applicant.isNeedPaperPolicy});
              this.submitData(updateloadApply);
            } else {
              return false
            }
          } else {
            this.$vux.toast.show({
              text: fm.getErrorMsg()
            })
          }
        })
      },
      submitData(updateloadApply) {
        this.axios.post(SAVEAPPLIANTADDINSURANT, updateloadApply)
          .then(({data}) => {
            if (data.success) {
              const {planId} = this
              this.$router.push({path: 'insurant', query:{planId}})
            } else {
              this.$vux.toast.show({
                text:data.errorMsg
              })
            }
          })
          .catch((err) => {
            console.log(err);
          })
      }
    },
    components: {
      formUnit,
      Tab,
      TabItem,
      zaOccupation,
      zaDate
    }
  }
</script>

<style lang='less' scoped>
  @import "../../../../assets/styles/page.less";
  .applicant-info{
    background-color:@bgGray;
    padding-bottom: 45px;
    .button-wrapper {
      margin-top: 24px;
      margin-bottom: 25px;
      text-align: center;
    }
    .vux-tab .vux-tab-item.vux-tab-selected {
      color: @btnBlue;
    }
    .vux-tab .vux-tab-item.vux-tab-disabled {
      color: #666;
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
