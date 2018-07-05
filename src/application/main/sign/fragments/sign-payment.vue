<!--
 电子签名-支付信息
-->
<template>
  <div class="page-sign-payment subject-coco">
    <za-title>支付信息</za-title>
    <section class="form-coco">
      <div class="group-input" v-if="wxPayAvailable">
        <div class="switch-pay-method">
          <span :class="{active: !wxPayActive}" @click="inactiveWXPay">银行转账</span>
          <span :class="{active: wxPayActive}" @click="activeWXPay">微信支付</span>
        </div>
      </div>
      <div class="group-input" v-if="wxPayActive">
        <label>支付金额</label>
        <input type="text" :value="charge" readonly>
        <span class="unit">元</span>
      </div>
      <za-title v-if="wxPayActive" class="title-inner">续期支付方式</za-title>
      <div class="group-input">
        <label>开户名</label>
        <input type="text" :value="accountName" readonly>
      </div>
      <div class="group-input">
        <label>开户银行</label>
        <div class="picker">
          <popup-picker placeholder="请选择开户银行" v-model="bank" :data="bankList" show-name />
          <input type="hidden" :value="model.bank" name="bank" v-validate:bank.initial="'required'" data-vv-as="请选择开户银行">
        </div>
        <span class="photo" @click="scanBankCard" v-if="inApp">
          <r-icon name="camera"/>
        </span>
      </div>
      <div class="group-input">
        <label>银行账号</label>
        <input type="text" placeholder="请填写银行账号" v-validate:account.initial="'required|bankcard'" data-vv-as="请填写银行账号"
               :value="account|number|bankCard" @change="updateAccount" name="account" maxlength="23">
      </div>
      <template v-if="!wxPayActive">
        <div class="group-input">
          <label>支付金额</label>
          <input type="text" :value="charge" readonly>
          <span class="unit">元</span>
        </div>
        <div class="group-input">
          <label>续期交费方式</label>
          <input type="text" value="同首期" readonly/>
        </div>
      </template>
      <div class="group-input" v-show="!wxPayActive">
        <label>手机号码</label>
        <input type="text" :value="mobile|number" @change="updateMobile" name="mobile"
               data-vv-as="请填写手机号码" v-validate="'required|mobile'" maxlength="11">
      </div>
    </section>
  </div>
</template>
<script>
  import { zaTitle,PopupPicker } from 'vformer'
  import {toast, equals, clone} from 'src'
  import {RIcon} from 'src/components'
  import {mapGetters} from 'vuex'
  import store, {ACTION} from 'src/store'
  import ChargeTypes from 'src/data/ChargeTypes'

  export default {
    name: 'sign-payment',
    components: {
      zaTitle, PopupPicker, RIcon
    },
    model: {
      event: 'update',
      prop: 'model'
    },
    props: {
      model: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        bankList: []
      }
    },
    computed: {
      ...mapGetters(['inApp']),
      // 支付方式
      payType: {
        get () {
          const {payType} = this.model
          return payType ? [payType] : ['0']
        },
        set ([payType]) {
          this.update({payType})
        }
      },
      wxPayAvailable () {
        return !this.inApp
      },
      // 开户户主名
      accountName: {
        get () {
          return this.model.accountName
        },
        set (accountName) {
          this.update({accountName})
        }
      },
      // 开户银行
      bank: {
        get () {
          const {bank} = this.model
          return bank ? [bank] : []
        },
        set ([bank]) {
          this.update({bank})
        }
      },
      // 银行账号
      account: {
        get () {
          return this.model.account
        },
        set (account) {
          account = account.replace(/\D/g, '')
          this.update({account})
        }
      },
      // 支付金额
      charge: {
        get () {
          return this.model.totalPremium
        },
        set (totalPremium) {
          this.update({totalPremium})
        }
      },
      // 手机号码
      mobile: {
        get () {
          return this.model.mobile
        },
        set (mobile) {
          this.update({mobile})
        }
      },
      chargeType: {
        get () {
          return this.model.chargeType
        },
        set (chargeType) {
          this.update({chargeType})
        }
      },
      wxPayActive () {
        return this.chargeType === ChargeTypes.WXPay
      }
    },
    watch: {
      'errors.errors' (to, from) {
        if (equals(to, from)) return
        this.$emit('validation', clone(this.errors.errors))
      }
    },
    created () {
      store.dispatch(ACTION.GET_BANKS, {payType: '0'}).then(banks => {
        this.bankList = [banks]
      })
    },
    methods: {
      // 扫描银行行
      scanBankCard () {
        this.nativeScan().then(this.onScan, toast).catch(console.error)
      },
      nativeScan () {
        // res： card_number银行卡号，issuer银行类别, type银行卡类别（借记卡or信用卡）
        return window.getBank().then(res => JSON.parse(res))
      },
      onScan (card) {
        return store.dispatch(ACTION.RESOLVE_CARD, {card}).then(bank => {
          this.account = card.card_number
          this.bank = [bank.value]
          this.form.cardImgUrl = card.cardImgUrl
        })
      },
      updateAccount (e) {
        this.account = e.target.value
      },
      updateMobile (e) {
        this.mobile = e.target.value
      },
      // 发起事件同步数据到父组件中
      update (append) {
        this.$emit('update', {...this.model, ...append})
      },
      activeWXPay () {
        this.chargeType = ChargeTypes.WXPay
      },
      inactiveWXPay () {
        this.chargeType = ChargeTypes.BankTransfer
      }
    }
  }
</script>

<style lang=less scoped>
  @import url("~@/assets/styles/page.less");

  @primaryColor: #5697ff;

  .page-sign-payment {

    .pay-tips {
      font-size: 11px;
      line-height: 18px;
      padding: 14px 15px 14px 0;
      color: @primaryColor;
      width: 100%;
    }

    .form-coco {
      background-color: white;
      padding-left: 15px;
      font-size: 14px;

      [readonly],
      [disabled] {
        background-color: white;
      }

      .vux-popup-picker-value {
        color: #999;
      }

      .group-input > input {
        box-sizing: border-box;
        display: block;
        text-align: right;
        line-height: 24px;
        border-radius: 2px;
        border: 0 none;
        padding: 10px 15px;
        color: #999;

        &:focus {
          outline: 0 none;
        }

        &:active {
          background-color: white;
        }
      }
      .group-input {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 0;
        line-height: 45px;

        > input[type=text] {
          flex: 1;
          font-size: inherit;
          font-weight: 400;
        }

        > label {
          max-width: 120px;
          word-break: break-all;
          line-height: 20px;
          margin-right: 5px;
          padding-top: 5px;
          padding-bottom: 5px;
          font-weight: 400;
        }
      }

      .group-input + .group-input::before {
        position: absolute;
        content: ' ';
        height: 1px;
        z-index: 1;
        left: 0;
        right: 0;
        top: 0;
        background-color: #D9D9D9;
        transform: scaleY(0.5);
      }

      .group-input:nth-last-child(1) + .group-input:nth-last-child(1)::after {
        position: absolute;
        content: ' ';
        height: 1px;
        z-index: 1;
        left: 0;
        right: 0;
        top: 0;
        background-color: #D9D9D9;
        transform: scaleY(0.5);
      }

      .picker {
        flex: 1;
        position: relative;
        z-index: 0;
        &.payment{
          padding: 10px 0;
        }
      }
      .photo {
        width: 55px;
        height: 44px;
        display: flex;
        border-left: 1px solid #efefef;
        img{
          display: block;
          width: 25px;
          height: 20px;
          margin: auto;
        }
      }
      .unit {
        color: #999;
        margin-right: 15px;
        margin-left: -13px;
      }
    }

    .switch-pay-method {
      flex: 1;
      display: flex;
      border: 1px solid @primaryColor;
      border-radius: 5px;
      margin: 10px 15px 10px 0;
      align-items: center;
      text-align: center;

      > span {
        flex: 1;
        line-height: 40px;
        color: @primaryColor
      }

      > span + span {
        border-left: 1px solid @primaryColor;
      }

      .active {
        color: white;
        background-color: @primaryColor;
      }
    }

    .title-inner {
      margin-left: -15px;
    }

    .tips {
      font-size: 12px;
      line-height: 20px;
      color: @primaryColor;
      margin: 15px 15px 0;
    }
    input::-webkit-input-placeholder{
      color: #999;
      font-weight: 300;
    }
  }
  .weui-cell_access  {
  	margin-right:15px;
	.weui-cell__ft{
	   padding-right:10px;
       &:after{
  	    content: " ";
	    display: inline-block;
	    height: 8px;
	    width: 8px;
	    border-width: 1px 1px 0 0;
	    border-color: #999;
	    border-style: solid;
	    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    top: -2px;
	    position: absolute;
	    top: 50%;
	    margin-top: -4px;
	    right: 2px;
  	  }
	}
  }
</style>

