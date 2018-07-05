<!--完善信息-->
<!-- 说明
  1. 所有被保人共用一个formUnit, formUnit只通过 formModel更新值(代码已实现)
  2. 当切换被保人时。(以下代码待完成)
     - 先从loadApply.insurants中取出该被保人的数据，记作 insX
     - 克隆formModel:  let newModel = this.__clone(this.formModel)
     - 调用__setModel方法，把数据赋值给newModel, 并最终更新formModel:
        this.__setModel(newModel, insX).then(res => {
          this.formModel = res
        })
  3. 只有采用这种方式，多formUnit才能实现动态赋值
 -->
<template>
  <div class="container insuran-Info">
    <tab bar-active-color="#5697ff">
      <tab-item disabled>投保人信息</tab-item>
      <tab-item selected>被保人信息</tab-item>
    </tab>
    <ul class="tabs-bar" v-if="loadApply.insurants">
      <li v-for="(item,index) in loadApply.insurants" :class="tabCls(index, loadApply.insurants.length)"
        @click="onSelect(index, item.insureSeq)" :key="index" v-if="loadApply.insurants && loadApply.insurants.length >=2">
        <p>{{item.name}}</p>
      </li>
    </ul>
    <div v-if="loadApply.insurants">
      <form-unit name="insurant" :formModels="formModel" @formEvent="onEvent">
        <template slot="contactTitle">
          <zaTitle>
            联系方式
            <slot slot="icon">
              <label for="sameappl">
                    <input type="checkbox" class="weui-check" id="sameappl"  @change="insurantChange" v-model="sameChecked">
                    <i class="icon-checked"></i>
                     <span class="title">同投保人</span>
              </label>
            </slot>
          </zaTitle>
        </template>
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
                <input type="checkbox" class="weui-check" id="longTime" @change="longTime" v-model="checked">
                <i class="icon-checked"></i>
                <span class="long-txt">长期</span>
              </label>
            </div>
          </div>
	      </template>
      </form-unit>
      <form-unit name="hemu" :formModels="hemujia" @formEvent="onEvent" v-if="loadApply.insurants[this.isSelect].hemujiaShowFlag === 'Y'"></form-unit>
      <div class="button-wrapper">
        <div class="btn-next" @click="saveSingle(false)" v-if="isSelect !== loadApply.insurants.length-1">保存</div>
        <div class="btn-next" @click="saveSingle(true)" v-else>下一步</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { formUnit, Tab, TabItem, zaTitle, zaDate} from "vformer";
import { modelData, hemujiaModal  } from "./formModel";
import {
  SAVESINGLEINSURANT,
  LOADAPPLYWITHMULTIINSURANTS,
  SAVENSURANT,
  GET_CITIZENSHIP_LIST
} from "@/api";
import zaOccupation from "@/components/occupation"
import {mapActions} from 'vuex'
import store, {ACTION} from 'src/store'
import * as ValidateRules from "@/widget/validate/myextends"
import {getBirthday, getSex, getAge} from '@/widget/util/index'
import {lingageChecke} from "../../check"
export default {
  name: "recognizee-info",
  data() {
    return {
      defaultModel: JSON.stringify(modelData),
      loadApply: {},
      isSelect: 0,
      planId: "",
      applyId: "",
      formModel: modelData,
      hemujia: hemujiaModal,
      defaulthemujia: JSON.stringify(hemujiaModal),
      insureSeqs: {},
      insureSeq: "",
      applicant: {},
      insurantsInfoSavedFlag: "N", //是否在点击的时候校验依次点击
      sameAppInfo: {
        //同投保人的联系方式的字段
        mobile: "",
        telphone: "",
        addr: {},
        zipcode: "",
        email: ""
      },
      hemujiaShowFlag: "",
      citizenship: [],
      validte: "",
      checked: false,
      checkList: [],
      sameChecked: false,
      sameCheckedList: [],
      idcardorpass: false
    };
  },
  watch: {
    isSelect(pre, old) {
      if (pre !== old) {
        // let newModel = this.__clone(this.forModel);
        let item = this.loadApply.insurants[this.isSelect];
        this.getConfiginfo(item, JSON.parse(this.defaultModel)).then(res => {
          this.formModel = res;
        });
        if (this.loadApply.insurants[this.isSelect].hemujiaShowFlag === 'Y') {
          this.getConfiginfo(item, JSON.parse(this.defaulthemujia)).then(res => {
            this.hemujia = res;
          });
        }
      }
    }
  },
  created() {
    window.test = this;
    console.log(this)
    this.planId = this.$route.query.planId;
    this.getCitizenship().then(() => {
        this.getloadApply(this.planId);
      })
  },
  methods: {
    getVlidate(){
      // debugger
      this.$nextTick(()=> {
          var f = this.getForm('insurant')
          this.validte = f.__proto__.formValidator.dictionary.dictionary.cn.messages;
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
    onEvent(t, v, name) {
        console.warn(t, `这次更新是由${name}触发的`, v)
        this.$nextTick(() => {
          if (name === "certType" ||
              name === "certValidity" ||
              (this.loadApply.insurants[this.isSelect].hemujiaShowFlag === "Y" && name ==="hasHemujiaVisit")
              )
            {
              let newModel = this.__clone(this.formModel);
              let insurant = this.getForm('insurant').formValues;
              Object.keys(newModel).map(key => {
                if(name === 'certType'){
                  if(key === "certNo"){
                    if(v.value[0] === '01'){
                      newModel[key].rules.vRules = "required|idcard"
                      // insurant["citizenship"] = "CHN"
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
                  // this.idcardorpass = v.value[0] === "01" || v.value[0] === "A" || v.value[0] === "10"|| v.value[0] === "11"
                  // if(v.value[0] !== "01" || v.value[0] !== "A" || v.value[0] !== "10" || v.value[0] !== "11"){
                  //   if(newModel["certValidity"].value == "9999-01-01"){
                  //     newModel["certValidity"].value == ""
                  //     insurant["certValidity"] = ""
                  //     this.checked = false
                  //   }
                  // }
                  // if(key === "certValidity"){
                  //   if(v.value[0] === "01" || v.value[0] === "A" || v.value[0] === "10"||v.value[0] === "11"){
                  //     newModel[key].rules.vRules = "required"
                  //   } else{
                  //     newModel[key].rules.vRules = ""
                  //   }
                }
                else if(name === "certValidity" && v.value !== "9999-01-01"){
                  this.checked = this.checkList[this.isSelect] = false;
                }
                 newModel[key].value = insurant[key];
              });
              this.formModel = newModel;

              if (this.loadApply.insurants[this.isSelect].hemujiaShowFlag === "Y") {
                  let newModel = this.__clone(this.hemujia);
                  let hemudata = this.getForm('hemu').formValues;
                  Object.keys(newModel).map(key => {
                    if(name === "hasHemujiaVisit" && key==="hemujiaRecord"){
                      if(v.value === "Y") {
                        newModel[key].rules.vRules = "required";
                      } else {
                        newModel[key].rules.vRules = "";
                      }
                    }
                    newModel[key].value = hemudata[key];
                  });
                this.hemujia = newModel
              }
            }
        });
      },
    getCitizenship(){
        return this.axios.get(GET_CITIZENSHIP_LIST)
          .then(({data}) => {
            if(!data.success) {
              this.__toast(data.errorMsg);
              return Promise.reject(errorMsg);
            }
            // 国籍
            this.citizenship = [data.value.dictItemList.map(item => {
              return {
                value: item.code,
                name: item.desc
              }
            })]
            Object.keys(modelData).map(key => {
              if(key === "citizenship"){
                modelData["citizenship"].rules.options = this.citizenship;
              }
            })
            this.defaultModel = JSON.stringify(modelData)
            return Promise.resolve()
          })
      },
      // 同被保人的联系方式
    insurantChange(e,mark) {
      console.log(e.target.name)
      if (e.target.checked) {
        this.sameChecked = this.sameCheckedList[this.isSelect] = true
        let newModel = this.__clone(this.formModel);
        let insurant = Object.assign(this.getForm("insurant").formValues, this.sameAppInfo);
        Object.keys(insurant).map(key => {
          newModel[key].value = insurant[key];
        });
        this.$nextTick(() => {
          this.formModel = newModel;
        });
      }
    },
    // 有效期为长期
    longTime(e){
        console.log(e.target.checked);
        // if (e.target.checked) {
          let newModel = this.__clone(this.formModel);
          let insurant = this.getForm("insurant").formValues;
          this.__setModel(newModel, insurant).then(res => {
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
    // tab 切换
    tabCls: function(index, len) {
      return [
        "tabs-tab",
        {
          "tabs-tab_3": len <= 3,
          "tabs-tab_4": len > 3,
          "tabs-tab-active_3": index === this.isSelect && len <= 3,
          "tabs-tab-active_4": index === this.isSelect && len > 3
        }
      ];
    },
    getloadApply(planId) {
      this.axios
        .post(LOADAPPLYWITHMULTIINSURANTS, { planId: planId })
        .then(({ data }) => {
          if (data.success) {
            let loadApply = data.value;
            // 是否依次去校验被保人
            if (loadApply.insurantsInfoSavedFlag) {
              this.insurantsInfoSavedFlag = "Y";
            }

             // 转换当前被保人的数据
            if (loadApply.insurants[this.isSelect].relation == "00") {
                loadApply.insurants[this.isSelect] = Object.assign(loadApply.insurants[this.isSelect], loadApply.applicant, {relation: '00'})
            }
            
            if(loadApply.insurants) {
              loadApply.insurants.forEach((item, index) => {
                if(index == 0){
                  item.relationFristInsure = "00"
                }
                this.sameChecked = this.sameCheckedList[index] = false;
                if(item.certValidity ==="9999-01-01"){
                  this.checkList[index] = true;
                }else{
                  this.checkList[index] = false;
                }

                if(item.citizenship == ""){
                  item.citizenship = 'CHN'
                }
                this.insureSeqs[item.insureSeq] = item;
                // this.idcardorpass = loadApply.insurants[this.isSelect].certType === "01" || loadApply.insurants[this.isSelect].certType === "A" || loadApply.insurants[this.isSelect].certType === "10"
              });
            }else {
              return this.$vux.toast.show({text: '被保人信息不存在'})
            }
            // 把‘同投保人’部分字段拷贝待用
            for (let key in this.sameAppInfo) {
              loadApply.applicant[key] &&
                (this.sameAppInfo[key] = loadApply.applicant[key]);
            }
            this.loadApply = loadApply;

            let item = loadApply.insurants[this.isSelect];
            this.getConfiginfo(item, JSON.parse(this.defaultModel)).then(res => {
              this.formModel = res;
               console.log(this.formModel)
            });
            //是否在和睦家就诊
            this.hemujiaShowFlag = loadApply.insurants[this.isSelect].hemujiaShowFlag;
            if (loadApply.insurants[this.isSelect].hemujiaShowFlag === "Y") {
              this.getConfiginfo(item, JSON.parse(this.defaulthemujia)).then(res => {
                this.hemujia = res;
              });
            }
            // 保存到本地
            this.applyId = loadApply.applyId;
            // 必须，否则不会渲染
            this.$nextTick(() => {
              // this.loadApply = loadApply;
              this.getVlidate()
            });
          } else {
            this.__toast(data.errorMsg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getConfiginfo(data, modelform) {
      // modelform 需要是formModel的拷贝
      let model = JSON.parse(JSON.stringify(modelform));
      // if(data.relation === "00"){
      //   delete model.relationFristInsure
      // }
      this.checked = this.checkList[this.isSelect]
      return this.__setModel(model, data).then(res => {
        Object.keys(res).map(key => {
            if(res.relation && res.relation.value === "00" && res[key].value){
              res[key].rules.readOnly = true;
            }
            else if (
                  (key === "relation" && res.relation) ||
                  (key === "name" && res.name) ||
                  (key === "birthday" && res.birthday) ||
                  (key === "genderCode" && res.genderCode)||
                  (key === "relationFristInsure" && res.relationFristInsure)
                ) {
                  res[key].rules.readOnly = true;
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
                res[key].rules.vRules = 'required'
              }
            }
        });
        return res;
      });
    },
    onSelect(v, data) {
      let insureSeq = this.loadApply.insurants[this.isSelect].insureSeq,
        flag = false;
      if (this.isSelect == this.loadApply.insurants.length - 1) {
        flag = true;
      }
      let insurant = {}, forms = ['insurant'];
           if (this.loadApply.insurants[this.isSelect].hemujiaShowFlag === "Y") {
              forms.push('hemu');
            }
          forms.map(item => {
            insurant = this.getForm(item).formValues;
            insurant = Object.assign(this.insureSeqs[insureSeq], insurant);
          });
          if (flag) {
            this.insurantsInfoSavedFlag = "Y";
          }
      this.validateAll().then(res => {
        if (res === true) {
          if(!lingageChecke(insurant)){
             return false
          }
          this.axios
            .post(SAVESINGLEINSURANT, {
              applyId: this.applyId,
              insurant: insurant,
              insurantsInfoSavedFlag: this.insurantsInfoSavedFlag
            }) // 记得换接口SAVENSURANT
            .then(({ data }) => {
              if (data.success) {
                this.getloadApply(this.planId);
                if (
                  this.isSelect != this.loadApply.insurants.length - 1 &&
                  this.insurantsInfoSavedFlag == "N"
                ) {
                  if (this.isSelect + 1 < v) {
                    this.__toast("请依次填完被保人信息");
                    this.isSelect = this.isSelect + 1;
                  } else {
                    this.isSelect = v;
                  }
                } else {
                  this.isSelect = v;
                }
              } else {
                this.__toast(data.errorMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          let errorMsg = res.getErrorMsg();
          this.$vux.toast.show({ text: errorMsg });
        }
      });
    },
    validateAll() {
      const formPromise = [];
      let forms = ["insurant"];  
      if (this.loadApply.insurants[this.isSelect].hemujiaShowFlag === "Y") {
          forms.push('hemu');
      }
      forms.map(form => {
        this.getForm(form)
          ? formPromise.push(this.getForm(form).validateAll())
          : "";
      });
      return Promise.all(formPromise)
        .then(res => {
          let unsolved = res.find(i => i !== true);
          if (unsolved === undefined) {
            return true;
          } else {
            return unsolved;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    saveSingle(flag) {
      let insureSeq = this.loadApply.insurants[this.isSelect].insureSeq;
      let insurant = {},forms = ['insurant'];
          if (this.loadApply.insurants[this.isSelect].hemujiaShowFlag === "Y") {
            forms.push('hemu');
          };
          forms.map(item => {
            // 收集所有的formUnit的值
            insurant = this.getForm(item).formValues;
            insurant = Object.assign(this.insureSeqs[insureSeq], insurant);
          });
          // 如果是最后一个select,则为Y
          if (flag) {
            this.insurantsInfoSavedFlag = "Y";
          }
      this.validateAll().then(res => {
        if (res === true) {
          if(!lingageChecke(insurant)){
             return false
          }
          this.axios
            .post(SAVESINGLEINSURANT, {
              applyId: this.applyId,
              insurant: insurant,
              insurantsInfoSavedFlag: this.insurantsInfoSavedFlag
            })
            .then(({ data }) => {
              if (data.success) {
                if (flag) {
                  const route = this.$route
                  const {planId} = route.query
                  store.dispatch(ACTION.GET_ROUTE_NEXT, {planId, route}).then(nextRoute => {
                    this.$router.push({...nextRoute, query: {...route.query, applyId: this.applyId}})
                  })
                  // this.$router.push({
                  //   path: "/beneficiary/beneficiary-list",
                  //   query
                  // });
                } else {
                  this.isSelect = this.isSelect + 1;
                  this.getloadApply(this.planId);
                }
              } else {
                this.$vux.toast.show({
                  text: data.errorMsg
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          // debugger
          console.log(res.getErrorMsg())
          let errorMsg = res.getErrorMsg();
          this.$vux.toast.show({ text: errorMsg });
        }
      });
    }
  },
  components: {
    formUnit,
    Tab,
    TabItem,
    zaTitle,
    zaOccupation,
    zaDate
  }
};
</script>

<style lang='less' scoped>
@import "../../../../assets/styles/page.less";
@import "../../../../assets/styles/form.less";
@import "../../../../assets/styles/weui/widget/weui_cell/weui_check";
@VMin: calc(100vw / 6);
@W: 120/2px;
@H: 120/2px;
.insuran-Info {
  background-color: @bgGray;
  padding-bottom: 45px;
  .vux-tab .vux-tab-item.vux-tab-selected {
    color: @btnBlue;
    border-bottom: 3px solid @btnBlue;
  }
  .vux-tab .vux-tab-item.vux-tab-disabled {
    color: #666;
  }
  .button-wrapper {
    margin-top: 24px;
    margin-bottom: 25px;
    text-align: center;
    .next {
      width: 350px;
      height: 46px;
    }
  }
  .tabs-bar {
    background-color: @white;
    box-sizing: border-box;
    display: flex;
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
      color: #ffffff;
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
  .title {
    color: #999999;
    font-size: 13px;
  }
  .form-title {
    background-color: #f7f7f7;
    overflow: hidden;
    height: 3rem;
    line-height: 3rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 1.07143rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .validate{
      width: 100%;
      padding-right: 10px;
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
