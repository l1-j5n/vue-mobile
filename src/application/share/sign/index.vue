<!--空中签名-->
<template>
  <div class="page-sign-share" v-if="ready">
    <div v-if="isMultipleRecordApply">
      <za-title>双录保单</za-title>
      <div class="group-switch">
        <label class="color-gray">是否已双录</label>
        <r-switch v-model="hasDoubleRecords" @update="updateDoubleRecords"/>
      </div>
    </div>

    <div class="panel-terms">
      <r-checkbox v-model="checkTerms" class="checkbox"/>
      <sign-clauses :clauses="clauses" class="clauses"/>
    </div>
    <sign-tax :taxInfo="taxInfo"  @update="updateTaxResident"/>

    <ul class="list-upload">
      <li>
        <div class="item-block">
          <span>投保日期</span>
          <span class="text">{{caInfo.applyDate}}</span>
        </div>
      </li>
      <li v-for="(item,index) in signInfo" :key="index">
        <r-gather v-model="signInfo[index]" @update="updateCaInfo"/>
      </li>
    </ul>

    <za-title>证件影像上传</za-title>
    <ul class="list-upload">
      <li v-for="(item,index) in certImageInfoList" :key="index">
        <r-gather-multiple richTitle v-model="certImageInfoList[index]" @update="updateUploadInfo"/>
      </li>
      <li>
        <p class="tips">温馨提示：证件影像必须上传，注意身份证必须上传正反面。</p>
      </li>
    </ul>

    <za-title>其他资料上传</za-title>
    <ul class="list-upload">
      <li v-for="(item,index) in otherImageInfoList" :key="index">
        <r-gather-multiple richTitle transferToChild :insurantIndex="index" v-model="otherImageInfoList[index]" @update="updateUploadInfo"/>
      </li>
      <li>
        <p class="tips">温馨提示：根据客户投保情况选择性上传资料。</p>
      </li>
    </ul>

    <sign-payment v-model="payInfo" @validation="onValidation"/> <!--支付信息-->

    <panel-countdown v-if="!wxPayActive"
      v-model="countModel" :mobile="mobile" @send="sendMessage"
      :disabled="!(multipleRecordVerify && checkTerms && checkTaxInfo && uploaded && payInfoValid)"/>

    <footer class="footer">
      <r-btn primary reverse @click="cachePayInfo" :disabled="submitDisabled">暂存</r-btn>
      <r-btn primary @click="submit" :disabled="submitDisabled">确认</r-btn>
    </footer>

  </div>
</template>
<script>
  import {zaTitle} from 'vformer'
  import {isFunction, clone, equals, fetch, toast, chain} from 'src'
  import {RBtn, RCheckbox, RSwitch, RGather, RGatherMultiple} from 'src/components'
  import signClauses from 'src/application/main/sign/fragments/clauses'
  import signTax from 'src/application/main/sign/fragments/sign-tax'
  import signPayment from 'src/application/main/sign/fragments/sign-payment'
  import panelCountdown from 'src/components/panel-countdown'
  import ChargeTypes from 'src/data/ChargeTypes'
  import API, {SMS_SEND_SHARE, SMS_VERIFY_SHARE, DELETEAPPLY} from 'src/api'
  export default {
    name: 'sign',
    components: {
      signClauses,
      signPayment,
      signTax,
      RGatherMultiple,
      panelCountdown,
      RBtn,
      RCheckbox,
      RSwitch,
      RGather,
      zaTitle
    },
    data () {
      return {
        ready: false,
        checkTerms: false,
        submitDisabled: false,
        validation: [],
        countModel: {on: false, value: ''},
        sendCount: 0, // 验证码发送次数
        caInfo: {},
        uploadInfo: {},
        payInfo: {},
        taxInfo: {}
      }
    },
    computed: {
      applyId () {
        return this.$route.query.applyId
      },
      // 是否是中国税居民 (Y, N)
      isChineseTaxResident: {
        get () {
          return this.taxInfo.isChineseTaxResident
        },
        set (isChineseTaxResident) {
          this.taxInfo.isChineseTaxResident = isChineseTaxResident
        }
      },
      // 是否是双录保单(true, false)
      isMultipleRecordApply: {
        get () {
          return this.caInfo.isDoubleRecords === 'Y'
        }
      },
      // 双录保单是否已双录(Y, N). Y表示已双录, N表示还没有双录
      hasDoubleRecords: {
        get () {
          return this.caInfo.hasDoubleRecords
        },
        set (hasDoubleRecords) {
          this.caInfo.hasDoubleRecords = hasDoubleRecords
        }
      },
      // 签名信息，caInfo是完整的CA一个数据模型，而signInfo只是其中的签名数据列表
      signInfo: {
        get () {
          return this.caInfo.caInfoList || []
        },
        set (caInfoList) {
          this.caInfo.caInfoList = caInfoList
        }
      },
      certImageInfoList: {
        get () {
          return this.uploadInfo.certImageInfoList || []
        },
        set (list) {
          this.uploadInfo.certImageInfoList = list
        }
      },
      otherImageInfoList: {
        get () {
          return this.uploadInfo.otherImageInfoListWithMultiInsurants || []
        },
        set (list) {
          this.uploadInfo.otherImageInfoListWithMultiInsurants = list
        }
      },
      // 手机验证码
      verCode: {
        get () {
          return this.countModel.value
        },
        set (verCode) {
          this.countModel.value = verCode
        }
      },
      mobile: {
        get () {
          return this.payInfo.mobile
        },
        set (mobile) {
          this.payInfo.mobile = mobile
        }
      },
      // 纳税信息是否完整
      checkTaxInfo: {
        get () {
          const {taxInfo} = this
          const a = taxInfo.isChineseTaxResident === 'Y'
          const b = taxInfo.isChineseTaxResident === 'N' && Array.isArray(taxInfo.taxCountry) && taxInfo.taxCountry.length > 0
          return a || b
        }
      },
      uploaded: {
        get () {
          return this.uploadVerify({tip: false})
        }
      },
      payInfoValid: {
        get () {
          return this.validation.length === 0
        }
      },
      clauses () {
        return this.caInfo.clauseList
      },
      wxPayActive () {
        return this.payInfo.chargeType === ChargeTypes.WXPay
      }
    },
    watch: {
      payInfo (to, from) {
        if (Object.keys(from).length === 0 || equals(to, from)) return
        if (this.countModel.on) {
          this.countModel.on = false
        }
      }
    },
    created () {
      this.fetchData().then(this.initData, this.alert).catch(console.error)
    },
    methods: {
      fetch,
      toast,
      chain,
      alert (content) {
        this.$vux.alert.show({title: '说明', content})
      },
      fetchData () {
        return this.fetch(API.SIGN.LOAD, {applyId: this.applyId})
      },
      initData (value) {
        const {caModel, payDTO, uploadImageModel, taxInfo} = value || {}
        this.caInfo = caModel || {}
        this.payInfo = payDTO || {}
        this.uploadInfo = uploadImageModel || {}
        this.taxInfo = taxInfo || {}
        this.ready = true
      },
      onValidation (arr) {
        this.$set(this, 'validation', arr)
      },
      // 校验手机验证码
      mobileValidate () {
        const templeteNo = 'HQAPP_001'
        const {verCode: content, mobile: phoneNo} = this
        return this.axios.post(SMS_VERIFY_SHARE, {phoneNo, content, templeteNo}).then(({data}) => {
          const {success, value, errorMsg, errorCode} = data
          if (success) {
            return Promise.resolve(value)
          } else {
            let msg = errorMsg || value.errMsg
            if (errorCode == 4) {
              this.sendCount++
              if (this.sendCount >= 3) {
                msg = '验证码连续输错3次，本次投保作废'
                this.deleteApply()
                this.setCount(0)
              } else {
                this.setCount(this.sendCount)
              }
            }
            return Promise.reject(msg)
          }
        })
      },
      // 更新税收居民信息
      updateTaxResident (isChineseTaxResident) {
        if (isChineseTaxResident === '') return
        const payload = {
          applyId: this.applyId,
          changeType: '2',
          taxInfo: {
            isChineseTaxResident
          }
        }
        this.taxInfo.isChineseTaxResident = isChineseTaxResident
        this.fetch(API.TAX.TOGGLE, payload).then(null, toast).catch(console.error)
      },
      infoSubmit () {
        const {applyId, caInfo: caModel, uploadInfo: uploadImageModel, taxInfo, payInfo: payDTO} = this
        const payload = {applyId, caModel, uploadImageModel, taxInfo, payDTO, smsContent: this.verCode}
        return this.fetch(API.SIGN.SUBMIT, payload, {timeout: 180000})
      },
      submit () {
        if (!this.validate()) return
        this.submitDisabled = true
        this.chain(
          this.validatePayInfo,
          this.savePayInfo,
          this.infoSubmit,
          this.success
        ).finally(() => {
          this.submitDisabled = false
        })
      },
      deleteApply () {
        const {applyId} = this
        return this.fetch(DELETEAPPLY, {applyId}).then(null, toast)
      },
      success (value) {
        const {status} = value
        this.status = status
        this.result = value
      },
      getCustomerTypeName (customerType) {
        return ({
          1: '投保人',
          2: '被保人',
          3: '受益人'
        })[customerType]
      },
      uploadVerify ({tip}) {
        const {caInfoList = []} = this.caInfo
        const {certImageInfoList: certs = [], otherImageInfoList: others = []} = this
        // 必填校验
        const required = it => {
          let {sign, photo, signImgPath, photoPath, desc} = it
          let valid = sign ? signImgPath : (photo ? photoPath : false)
          if (!valid && tip) {
            this.toast(`请完善${desc}`)
          }
          return valid
        }
        // 上传数量校验
        const numValidate = it => {
          let {imagePathList, minNum, name, certType, customerName, customerType} = it
          let valid = true
          if (minNum != null && minNum > 0) {
            if (!(Array.isArray(imagePathList) && imagePathList.length >= minNum)) {
              valid = false
              if (tip) {
                name = name || this.getCustomerTypeName(customerType) + `(${customerName})的${certType}`
                this.toast(`${name}至少需要上传${minNum}张`)
              }
            }
          }
          return valid
        }
        // 其它资料数量校验
        const otherNumValidate = it => {
          return it.imageInfo.every((sIt)=>{
            let {imagePathList, minNum, name} = sIt
            let { certType, customerName, customerType} = it
            let valid = true
            if (minNum != null && minNum > 0) {
              if (!(Array.isArray(imagePathList) && imagePathList.length >= minNum)) {
                valid = false
                if (tip) {
                  name = this.getCustomerTypeName(customerType) + `(${customerName})的${name}`
                  this.toast(`${name}至少需要上传${minNum}张`)
                }
              }
            }
            return valid
          })
        }
        return caInfoList.every(required) && certs.every(numValidate) && others.every(otherNumValidate)
      },
      countVerify () {
        if (this.sendCount >= 3) {
          this.toast('验证码连续输错3次，本次投保作废')
          return false
        }
        return true
      },
      verCodeVerify () {
        if (!/^\d{6}$/.test(this.verCode)) {
          this.toast(`验证码只能是6位数字`)
          return false
        }
        return true
      },
      // 双录校验
      multipleRecordVerify ({tip}) {
        if (this.isMultipleRecordApply) {
          if (this.hasDoubleRecords === null) {
            if (tip) this.toast('请确认是否已双录')
            return false
          }
          if (this.hasDoubleRecords === 'N') {
            if (tip) this.toast('本次投保计划符合保监双录要求，必须完成双录才能进行投保！')
            return false
          }
        }
        return true
      },
      validate (specify) {
        let map = {
          multipleRecordVerify: this.multipleRecordVerify,
          checkTerms: '请先阅读条款',
          checkTaxInfo: '请填写税收居民信息',
          uploaded: this.uploadVerify,
          verCode: '请验证手机号码',
          countVerify: this.countVerify,
          verCodeVerify: this.verCodeVerify
        }
        let verify = key => {
          if (isFunction(map[key])) {
            return map[key]({tip: true})
          } else {
            const pass = this[key]
            if (!pass) {
              this.toast(map[key])
            }
            return pass
          }
        }
        specify = specify || Object.keys(map)
        return Array.isArray(specify) ? specify.every(verify) : verify(specify)
      },
      validatePayInfo () {
        const {payInfo} = this
        if (!payInfo.bank) {
          return Promise.reject('请选择银行')
        } else if (!payInfo.account) {
          return Promise.reject('请填写银行账号')
        } else if (!payInfo.mobile) {
          return Promise.reject('请填写手机号')
        }
        const {validation} = this
        return validation.length ? Promise.reject(validation[0].msg) : Promise.resolve()
      },
      savePayInfo (buffer = {}) {
        return this.fetch(API.SIGN.CACHE.PAY, {...this.payInfo, ...buffer})
      },
      // 缓存支付信息(指定后端跳过校验)
      cachePayInfo () {
        this.submitDisabled = true
        return this.savePayInfo({saveType: false})
          .then(() => toast('暂存成功'), toast)
          .catch(console.error)
          .finally(() => {
            this.submitDisabled = false
          })
      },
      cacheCaInfo () {
        return this.fetch(API.SIGN.CACHE.CA, this.caInfo)
      },
      updateCaInfo () {
        this.chain(this.cacheCaInfo)
      },
      cacheUploadInfo () {
        return this.fetch(API.SIGN.CACHE.UPLOAD, this.uploadInfo)
      },
      updateUploadInfo () {
        this.chain(this.cacheUploadInfo)
      },
      sendMessage () {
        if (!this.validate(['multipleRecordVerify', 'checkTerms', 'checkTaxInfo', 'uploaded'])) {
          console.log('no pass!')
          return
        }
        this.chain(this.validatePayInfo, this.savePayInfo, this.send)
      },
      send () {
        const {mobile, applyId} = this
        this.axios.post(API.CODE_VERIFY.SEND, {phoneNo: mobile, applyId}).then(value => {
          this.countModel.on = true
          return value
        })
      },
      endEditTax (data) {
        this.isEditTax = false
        this.taxInfo = {
          ...this.taxInfo,
          name: data.basicApntInfo.firstName + '/' + data.basicApntInfo.familyName,
          taxCountry: data.taxAreas.map(it => it.taxCountry || it.taxCounty)
        }
        history.back()
      },
      // 打开税收地区信息编辑面板
      openTaxEditPanel () {
        this.isEditTax = true
        this.cached()
        // 在税收信息编辑视图中点击返回,应返回当前视图, 故添加一个history项
        history.pushState(history.state, document.title, location.pathname + location.search + '#editTax')
      },
      recommit () {
        let url = new URL(location.href)
        url.removeKey('status')
        url.invoke({replace: true})
        this.status = null
        this.submit()
      },
      updateDoubleRecords (hasDoubleRecords) {
        const payload = {
          applyId: this.applyId,
          changeType: '1',
          doubleInfo: {
            hasDoubleRecords
          }
        }
        this.fetch(API.DOUBLE_RECORD.TOGGLE, payload).then(null, toast).catch(console.error)
      }
    }
  }
</script>
<style lang='less'>
  @import url("~@/assets/styles/page.less");

  @primaryColor: #5697ff;
  @color-split: #e1e1e1;

  body {
    overflow: hidden;
  }

  iframe {
    border: 0 none;
  }

  .page-sign-share{
    background-color:#f7f7f7;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    ul {
      list-style-type: none;
      display: block;
      margin: 0;
    }

    .item-block{
      line-height: 45px;
      display: flex;
      .text {
        font-size: 15px;
        color: #999;
        padding-right: 15px;
        text-align: right;
        flex: 1;
      }
    }

    p {
      margin: 0;
    }
    .mask{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 2;
    }
    .group-switch {
      display: flex;
      background-color: white;
      justify-content: space-between;
      align-items: center;
      line-height: 25px;
      padding: 8px 15px;
    }
  }
  .panel-terms{
    background-color: #f7f7f7;
    padding: 15px;
    line-height: 24px;
    display: flex;
    align-items: flex-start;
    color: #999;
    font-size: 15px;

    .checkbox {
      margin-top: 4px;
    }

    .clauses {
      flex: 1;
    }
  }

  a{
    text-decoration: none;
    color: @primaryColor;
  }

  .btn-upload {
    width: 45px;
    height: 45px;
    display: flex;
    margin-right: 5px;
    .sign {
      /*background: url("~@/assets/image/sign.png") no-repeat center;*/
      background-size: contain;
      width: 25px;
      height:25px;
      display: block;
      margin: auto;
    }
    .camera {
      /*background: url("~@/assets/image/camera.png") no-repeat center;*/
      background-size: 24px 19.5px;
      width: 24px;
      height:20px;
      display: block;
      margin: auto;
      position: relative;
      padding: 12.5px 10.5px;
      input[type=file]{
        position: absolute;
        width: 100%;
        height:100%;
        left:0;
        top:0;
        border: 0 none;
        opacity: 0;
      }
    }
  }
  .list-preview{
    line-height: 0;
    &::after{
      content: ' ';
      clear: both;
      display: block;
      line-height: 0;
      height: 0;
    }
    &:empty::after{
      content:'';
      clear: none;
    }
    .item{
      float: left;
      margin: 8px 12px 8px 0;
      width: 50px;
      height: 50px;
      position: relative;
      z-index: 0;
      > i{
        position: absolute;
        display: block;
        top: -10px;
        right: -10px;
        width: 20px;
        height: 20px;
        /*background: url('~@/assets/image/dele.png') no-repeat;*/
        background-size: contain;
        z-index:1;
      }
      em{
        display: block;
        width: 50px;
        height: 50px;
        overflow: hidden;
      }
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .list-upload {
    background-color: #fff;
    padding-left: 15px;
    list-style: none;

    > li {
      position: relative;
    }

    > li + li::before {
      .setTopLine()
    }

    li > .tips {
      padding: 15px 0;
      font-size: 11px;
      color: @primaryColor;
    }
  }

  .list-minor{
    li {
      padding: 2px 0;
    }
    h3{
      line-height: 24px;
      margin: 8px 12px;
    }
    .btn-upload{
      margin-top: -2px;
    }
    .list-preview{
      .item{
        margin-bottom: 8px
      }
    }
  }

  .footer {
    padding: 25px 7.5px;
    display: flex;
    button {
      flex: 1;
      margin: 0 7.5px;
    }
  }

</style>
