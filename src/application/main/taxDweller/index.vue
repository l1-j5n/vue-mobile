<!--
  税收居民
-->
<template>
  <div class="page-tax-dweller">

    <div class="tax-checker">
      <div class="header">
        <div class="title">
          <div class="name">投保人</div>
          <div class="taxcheck_content">{{applicantName}}</div>
        </div>
      </div>
      <Radio
        :options="prolist"
        position='left'
        :checked="checkList1"
        v-model="checkList1"
      ></Radio>
    </div>
    <div class="tax-checker">
      <form-unit name="formModel1"
                 :formModels="formModel1"
                 @onInit="formUnitInit"
      >
      </form-unit>

      <form-unit name="formModels2"
                 :formModels="formModels2"
                 @formEvent="formModels2Change"
                 @onInit="formUnitInit"
      >
      </form-unit>


      <div>
        <za-title className="main-title">
          税收信息
        </za-title>
        <form-unit name="formModel3"
                   :formModels="formModel3"
                   @formEvent="formModels3Change"
                   @onInit="formUnitInit"
        >
          <template slot="taxPayerId" v-if="formModels3_More">
            <div class="reason bef">
              <p>请选择原因:</p>
              <Radio
                :options="formModels3_More_List"
                position='right'
                :checked="checkList2"
                v-model="checkList2"
              ></Radio>
              <div class="reasonDetail" v-if="checkList2 == 2">
                <textarea class="textarea" v-model="reasonDetail" placeholder="请输入具体原因"></textarea>
              </div>
            </div>
          </template>
        </form-unit>
      </div>

      <div v-if="formModel4">
        <za-title className="main-title">
          税收信息2
          <slot slot="icon"><span class="icon_clear" @click="delTaxInformation2"></span></slot>
        </za-title>
        <form-unit name="formModel4"
                   :formModels="formModel4"
                   @formEvent="formModels4Change"
                   @onInit="formUnitInit"
        >
          <template slot="taxPayerId" v-if="formModels4_More">
            <div class="reason">
              <p>请选择原因:</p>
              <Radio
                :options="formModels4_More_List"
                position='right'
                :checked="checkList3"
                v-model="checkList3"
              ></Radio>
              <div class="reasonDetail" v-if="checkList3 == 2">
                <textarea class="textarea" v-model="reasonDetail2" placeholder="请输入具体原因"></textarea>
              </div>
            </div>
          </template>
        </form-unit>
      </div>
    </div>

    <div class="btn-container">
      <div class="btn-add" @click="addTaxInformation">
        <span class="icon-add-blue"></span>
        <span>增加税收居民国(地区)</span>
      </div>
    </div>
    <div class="dec">
      <p class='dec-confirm' :class="{ checked: checked }" @click='checked = !checked'>本人确认上述信息的真实、准确和完整，且当这些信息发生变更时，将在30日内通知贵机构，否则本人承担由此造成的不利后果。</p>
      <input class="hiddenInput" type="hidden" name="clauseValue" v-model.trim="clauseValue" v-validate data-vv-as="请阅读该险种的相关利益" data-vv-rules="required">
    </div>
    <div class="btn-wrapper">
      <div class="btn-next" @click="nextStep">提交</div>
    </div>
  </div>
</template>

<script>
  import dateFormat from "@/widget/util/dateFormat";
  // 导入formUnit
  import {
    formUnit,
    zaInput,
    zaSelect,
    zaTitle,
    Tab,
    TabItem,
    AlertPlugin,
    ConfirmPlugin,
    ToastPlugin,
    checkList
  } from "vformer";
  import { Radio } from "../../../components/index";
  // 导入配置信息
  import { formModel1, formModel2, formModel3, formModel2Add } from "./formModel";
  // api
  import { TAX_INFO, APP_TAX_HOLD } from "@/api";
  import {mapGetters} from 'vuex'
  export default {
    name: 'TaxDweller',
    components: {
      formUnit,
      zaInput,
      zaSelect,
      zaTitle,
      Tab,
      TabItem,
      checkList,
      Radio
    },
    data() {
      return {
        formCollection: {},
        initData: null,
        applicantName: "",
        formModel1,
        formModels2: {
          isBirthAddr: {
            value: null
          },
          countryDesc: {
            value: null
          }
        },
        formModel3: {
          hasTaxPayerId: {
            value: null
          }
        },
        formModel4: null,
        formModels2_More: null,
        formModels3_More: null,
        formModels4_More: null,
        formModels3_More_List: [
          {
            key: "居民国(地区)不发放纳税人识别号",
            value: "1"
          },
          {
            key: "账户持有人未能取得纳税人识别号",
            value: "2"
          }
        ],
        formModels4_More_List: [
          {
            key: "居民国(地区)不发放纳税人识别号",
            value: "1"
          },
          {
            key: "账户持有人未能取得纳税人识别号",
            value: "2"
          }
        ],
        checkList1: null,
        checkList2: null,
        checkList3: null,
        prolist: [
          {
            key: "仅为非中国税收居民",
            value: "02"
          },
          {
            key: "既是中国税收居民又是其他国家（地区）税收居民",
            value: "03"
          }
        ],
        checked: false,
        reasonDetail: "",
        reasonDetail2: ""
      };
    },
    computed: {
      ...mapGetters(['inApp']),
      applyId () {
        return this.$route.query.applyId
      },
      clauseValue() {
        return this.checked ? 1 : false;
      },
      _formModels2() {
        return this.formModels2.isBirthAddr.value;
      },
      _formModel3() {
        return this.formModel3.hasTaxPayerId.value;
      },
      _formModel4() {
        return this.formModel4;
      }
    },
    watch: {
      _formModels2(newval, oldval) {
        let data = {
          name: "isBirthAddr",
          value: newval
        };
        this.formModels2Change("onChange", data);
      },
      _formModel3(newval, oldval) {
        let data = {
          name: "hasTaxPayerId",
          value: newval
        };
        this.formModels3Change("onChange", data);
      },
      _formModel4(newval, oldval) {
        if (!newval) {
          return;
        }
        if (newval.hasTaxPayerId.value == "N") {
          let data = {
            name: "hasTaxPayerId",
            value: newval.hasTaxPayerId.value
          };
          this.formModels4Change("onChange", data);
        }
      }
    },
    created() {
      this.oninit();
    },
    methods: {
      oninit() {
        this.formModels2 = JSON.parse(JSON.stringify(formModel2));
        this.formModel3 = JSON.parse(JSON.stringify(formModel3));
        this.getData();
      },
      checkListSelected(value, label) {
        // console.log("value", value);
        this.checkList1 = [];
        this.$set(this.checkList1, 0, value[value.length - 1]);
      },
      formModels2Change(type, val) {
        // 投保地出生地址点否
        if (val.name == "isBirthAddr" && val.value == "N") {
          if (!this.formModels2_More) {
            this.formModels2_More = formModel2Add;
            for (let key in this.formModels2_More) {
              this.$set(this.formModels2, key, this.formModels2_More[key]);
            }
            // 回显操作
            if (this.initData != null) {
              this.initData.birthAddress && Object.keys(this.initData.birthAddress).map(item => {
                this.formModels2[item].value = this.initData.birthAddress[item];
              });
            }
          } else {
            for (let key in this.formModels2_More) {
              this.$set(this.formModels2, key, this.formModels2_More[key]);
            }
          }
        } else if (val.name == "isBirthAddr" && val.value == "Y") {
          // console.log("投保人出生地址点是：", this.formModels2);
          if (Object.keys(this.formModels2).length > 2) {
            this.formModels2.countryDesc.rules.vRules = "";
            this.formModels2.provinceDesc.rules.vRules = "";
            this.formModels2.cityDesc.rules.vRules = "";
            this.formModels2.detail.rules.vRules = "";
          }
          this.formModels2_More = null;
          this.formModels2 = JSON.parse(JSON.stringify(formModel2));
        }
      },
      formModels3Change(type, val) {
        // 纳税人识别号点无
        if (val.name == "hasTaxPayerId" && val.value == "N") {
          this.formModel3.taxPayerId.rules.vRules = "";
          this.formModels3_More = true;
        } else if (val.name == "hasTaxPayerId" && val.value == "Y") {
          this.formModels3_More = false;
          // this.checkList2 = null;
        }
      },
      formModels4Change(type, val) {
        // 纳税人识别号点无
        if (val.name == "hasTaxPayerId" && val.value == "N") {
          this.formModel4.taxPayerId.rules.vRules = "";
          this.formModels4_More = true;
        } else if (val.name == "hasTaxPayerId" && val.value == "Y") {
          this.formModels4_More = false;
          // this.checkList2 = null;
        }
      },
      formUnitInit(v) {
        this.formCollection[v.name] = v;
        // if(v.name == 'formModels2') {
        //   console.log(v.formModels.isBirthAddr.value)
        // }
      },
      form4UnitInit(v) {
        // console.log("init", v);
      },
      addTaxInformation() {

        if (this.formModel4 && Object.keys(this.formModel4).length > 0) {
          this.__toast("最多添加两条税收信息");
          return;
        }
        this.formModel4 = JSON.parse(JSON.stringify(formModel3));
        let main_title = this.$children.filter(item => {
          // console.log(this.$children);
          return item.className == "main-title";
        });
        main_title[0].$el.innerHTML =
          '<div class="msg">          税收信息1          </div> <div class="icon"></div>';

        // 回显操作
        if (this.initData != null && this.initData.taxAreas[1]) {
          Object.keys(this.formModel4).map(item => {
            this.formModel4[item].value = this.initData.taxAreas[1][item];
          });
        }
      },
      delTaxInformation() {
        this.formModel3 = null;
      },
      delTaxInformation2() {
        this.formModel4 = null;
        this.formModels4_More = null;
        delete this.formCollection["formModel4"];
        let main_title = this.$children.filter(item => {
          return item.className == "main-title";
        });
        main_title[0].$el.innerHTML =
          '<div class="msg">          税收信息          </div> <div class="icon"></div>';
      },
      getData() {
        let { applyId } = this.$route.query;
        return this.axios
          .post(TAX_INFO, {
            applyId: applyId
          })
          .then(({ data }) => {
            if (data.success) {
              this.$nextTick(() => {
                // 回显
                const val = data.value;
                this.initData = val;
                this.applicantName = val.applicantName;
                this.checkList1 = val.taxType;

                // 投保人回显
                Object.keys(val.basicApntInfo).map(item => {
                  Object.keys(this.formModel1).map(key => {
                    if (item == key) {
                      if (this.formModel1[key]["rules"]["type"] == "za-date") {
                        this.formModel1[key].value = dateFormat(
                          val[item],
                          "yyyy-MM-dd"
                        );
                      } else {
                        this.formModel1[key].value = val.basicApntInfo[item];
                      }
                    }
                  });
                });

                Object.keys(val.currentAddress).map(item => {
                  Object.keys(this.formModel1).map(key => {
                    if (item == key) {
                      this.formModel1[key].value = val.currentAddress[item];
                    }
                  });
                });

                this.formModels2.isBirthAddr.value = val.isBirthAddr;

                Object.keys(this.formModel3).map(item => {
                  this.formModel3[item].value = val.taxAreas[0][item];
                });
                this.checkList2 = val.taxAreas[0].reasonType;
                this.reasonDetail = val.taxAreas[0].reason;

                if (val.taxAreas[1]) {
                  if (Object.keys(val.taxAreas[1]).length >= 1) {
                    this.addTaxInformation();
                  }

                  this.checkList3 = val.taxAreas[1].reasonType;
                  this.reasonDetail2 = val.taxAreas[1].reason;
                }
              });
            }
          });
      },
      validateAll() {
        // get form
        const forms = Object.keys(this.formCollection);
        // console.log(this.formCollection);
        // get form promised
        const formPromise = [];
        forms.map(
          form =>
            this.formCollection[form]
              ? formPromise.push(this.formCollection[form].validateAll())
              : ""
        );
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
            // console.log(e);
          });
      },
      nextStep() {
        let subData = {};
        this.validateAll().then(res => {
          if (res === true) {
            if (!this.checked) {
              this.__toast("请阅读条款");
            } else {
              //校验通过，获取表单值
              const _self = this.formCollection;
              // console.log(_self);
              const forms = Object.keys(_self);
              let { applyId } = this.$route.query;
              subData["taxType"] = this.checkList1;
              subData["applyId"] = applyId;
              subData["basicApntInfo"] = {};
              subData["currentAddress"] = {};
              subData["birthAddress"] = {};
              subData["taxAreas"] = [];

              forms.map(item => {
                if (item == "formModel1") {
                  let Currentval = _self[item].formValues;
                  Object.keys(Currentval).map(key => {
                    if (
                      key == "firstName" ||
                      key == "familyName" ||
                      key == "birthday"
                    ) {
                      subData["basicApntInfo"][key] = Currentval[key];
                    } else {
                      subData["currentAddress"][key] = Currentval[key];
                    }
                  });
                }

                if (item == "formModels2") {
                  let Currentval = _self[item].formValues;
                  Object.keys(Currentval).map(key => {
                    subData["birthAddress"][key] = Currentval[key];
                  });
                }

                if (item == "formModel3" || item == "formModel4") {
                  let Currentval = _self[item].formValues;
                  if (Currentval.hasTaxPayerId == "Y") {
                    Currentval["reasonType"] = "";
                    Currentval["reason"] = "";
                  }
                  subData["taxAreas"].push(Currentval);
                }

                Object.keys(subData["basicApntInfo"]).map(item => {
                  subData[item] = subData["basicApntInfo"][item];
                });
                Object.keys(subData["currentAddress"]).map(item => {
                  subData[item] = subData["currentAddress"][item];
                });
                subData["isBirthAddr"] = subData["birthAddress"].isBirthAddr;
                // 如果是投保人出生地址，清空数据
                if (subData["isBirthAddr"] == "Y") {
                  subData["birthAddress"]["countryDesc"] = "";
                  subData["birthAddress"]["provinceDesc"] = "";
                  subData["birthAddress"]["cityDesc"] = "";
                  subData["birthAddress"]["detail"] = "";
                }

                subData["taxAreas"].map((item, index) => {
                  // 纳税人识别号点否
                  if (item.hasTaxPayerId == "N") {
                    item.taxPayerId = "";
                    if (index == 0) {
                      item["reasonType"] = this.checkList2;
                      item["reason"] = this.reasonDetail;
                    } else {
                      item["reasonType"] = this.checkList3;
                      item["reason"] = this.reasonDetail2;
                    }
                  } else {
                    // 纳税人识别号点是
                    if (index == 1) {
                      this.checkList3 = null;
                    } else if (index == 0) {
                      this.checkList2 = null;
                    }
                  }
                });
              });
              // console.log(subData);

              // 所有校验通过调用保存接口
              this.axios.post(APP_TAX_HOLD, subData).then(({ data }) => {
                if (data.success) {
                  this.$router.back()
                } else {
                  this.__toast(data.errorMsg);
                }
              });
            }
          } else {
            let errorMsg = res.getErrorMsg();
            this.$vux.toast.show({ text: errorMsg });
          }
        });
      }
    }
  };
</script>
<style lang='less' rel="stylesheet/less" scoped>
  @import "~@/assets/styles/page.less";
  // @import '~@/assets/scss/function';
  .dec {
    margin: 25px 15px;
  }

  .dec-confirm {
    font-size: 15px;
    color: #999999;
    /*font-weight:bold;*/
    padding-left: 32px;
    background: url(~@/assets/styles/images/checke.png) no-repeat;
    background-size: 20px 20px;
    background-position-y: 5px;
    /*<!--background-position:0 -33.5px;-->*/
  }
  .dec-confirm.checked {
    font-size: 15px;
    color: #00aeff;
    /*font-weight:bold;*/
    padding-left: 32px;
    background: url(~@/assets/styles/images/checked.png) no-repeat;
    background-size: 20px;
    background-position-y: 5px;
  }
  .reason {
    position: relative;
    padding: 0 15px;
    & > p {
      color: #999999;
      position: relative;
      padding: 15px;
    }
    & > p:before {
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #d9d9d9;
      color: #d9d9d9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      left: 0.71429rem;
    }
  }
  .reason:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 1.07143rem;
  }
  .reasonDetail {
    padding-left: 45px;
  }
</style>
<style lang='less' rel="stylesheet/less" scoped>
  @import "~@/assets/styles/page.less";
  .page-tax-dweller {
    padding-bottom: 60px;
  @include fullpage;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f7f7f7;

    .tax-checker {
      .header {
        // @include borderbottom-1px(#efefef);
        padding-left: 15px;
        background-color: #fff;
        .title {
          // @include borderbottom-1px(#efefef);
          display: flex;
          border-bottom: 1px solid #efefef;
          min-height: 45px;
          line-height: 45px;
          .name {
            color: #999;
            font-size: 15px;
            padding-right: 10;
          }
          .taxcheck_content {
            margin-left: 10px;
            font-size: 15px;
          }
        }
      }
    }

    .btn-container {
      margin-top: 5px;
      background-color: @bgGray;
      .btn-add {
        color: @btnBlue;
        font-size: 17px;
        background-color: @white;
        text-align: center;
        display: block;
        padding-top: 20px;
        padding-bottom: 20px;
        border: 1px solid #efefef;
        .icon-add-blue {
          margin-right: 2px;
        }
      }
    }

    .textarea {
      height: 100px;
      width: 100%;
    }
  }
</style>
