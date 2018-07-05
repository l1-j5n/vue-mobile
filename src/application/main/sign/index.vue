<!--电子签名-->
<template>
  <div class="page-sign-app">
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
    <sign-tax :taxInfo="taxInfo" @update="updateTaxResident"/>

    <ul class="list-upload">
      <li>
        <div class="item-block">
          <span>投保日期</span>
          <span class="text">{{caInfo.applyDate}}</span>
        </div>
      </li>
      <li v-for="(item,index) in caInfo.caInfoList" :key="index">
        <r-gather v-model="caInfo.caInfoList[index]" @update="updateCaInfo"/>
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

    <panel-countdown
      v-model="countModel" @send="sendMessage" :mobile="mobile"
      :disabled="!(multipleRecordVerify && checkTerms && checkTaxInfo && uploaded && payInfoValid)"/>

    <footer class="footer">
      <r-btn primary reverse @click="cachePayInfo" :disabled="submitDisabled">暂存</r-btn>
      <r-btn primary @click="confirmSign" :disabled="submitDisabled">确认支付</r-btn>
    </footer>

  </div>
</template>
<script>
  import {zaTitle} from 'vformer'
  import {isFunction, equals, clone, fetch, toast, chain} from 'src'
  import signTax from 'src/application/main/sign/fragments/sign-tax'
  import signClauses from './fragments/clauses'
  import signPayment from './fragments/sign-payment'
  import panelCountdown from 'src/components/panel-countdown'
  import {RBtn, RGather, RGatherMultiple, RCheckbox, RSwitch} from 'src/components'
  import store, {ACTION} from 'src/store'
  import {mapGetters} from 'vuex'
  import API, {DE_SIGN_AIR, INFO_SHARE_SIGNATURE, APPLYSUBMIT, SMSVERIFY, DELETEAPPLY, SMS_SEND, SIGN_E_SAVE} from 'src/api'
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
        checkTerms: false,
        submitDisabled: false,
        validation: [],
        countModel: {on: false, value: ''},
        isAirSignSuccess: false,
        sendCount: 0, // 验证码发送次数
        caInfo: {},
        uploadInfo: {},
        payInfo: {},
        taxInfo: {}
      }
    },
    computed: {
      ...mapGetters(['inApp']),
      // 是否可以空中签名
      canAir () {
        const {canAir} = this.$route.query
        return canAir === '1'
      },
      applyId () {
        return this.$route.query.applyId
      },
      // 纳税信息是否完整
      checkTaxInfo: {
        get () {
          const {taxInfo} = this
          if (taxInfo) {
            const a = taxInfo.isChineseTaxResident === 'Y'
            const b = taxInfo.isChineseTaxResident === 'N' && Array.isArray(taxInfo.taxCountry) && taxInfo.taxCountry.length > 0
            return a || b
          }
          return false
        }
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
        set (value) {
          this.model.value = value
        }
      },
      mobile: {
        get () {
          return this.payInfo.mobile
        },
        set (mobile) {
          this.caInfo.mobile = mobile
          this.payInfo.mobile = mobile
        }
      },
      // 资料是否已上传完毕，用作获取验证码的守卫条件
      uploaded: {
        get () {
          return this.uploadVerify({tip: false})
        }
      },
      // 支付信息是否是通过校验的
      payInfoValid: {
        get () {
          return this.validation.length === 0
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
      // 代理人签名信息
      agentSignInfo: {
        get () {
          return this.signInfo.find(it => it.code === 'code_agent') || {}
        },
        set (agentSignInfo) {
          const index = this.signInfo.findIndex(it => it.code === 'code_agent')
          this.signInfo[index] = agentSignInfo
        }
      },
      // 代理人签名图片
      agentSignImgPath: {
        get () {
          return this.agentSignInfo.signImgPath
        },
        set (signImgPath) {
          this.agentSignInfo.signImgPath = signImgPath
        }
      },
      clauses () {
        return this.caInfo.clauseList
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
    beforeDestroy () {
      window.removeEventListener('visibilitychange', this.backProgressAfterShare)
    },
    // beforeRouteEnter时，路由和store还没有初始化(如果直接加载该页面的话)
    beforeRouteEnter (to, from, next) {
      const inApp = store.getters.inApp
      const {applyId} = to.query
      if (!inApp || from.name !== 'view-insurerpact') {
        next()
        return
      }
      fetch(API.CA.RESET, {applyId}).then(null, toast).finally(() => next())
    },
    beforeRouterLeave (to, from, next) {
      const inApp = store.getters.inApp
      const {planId} = from
      if (!inApp) {
        next()
        return
      }
      store.dispatch(ACTION.GET_ROUTE_PREV, {planId, route: from}).then(prevRoute => {
        const isPrev = prevRoute && (prevRoute.name === to.name || prevRoute.path === to.path)
        const {isAirSignSuccess} = this
        if (isPrev && isAirSignSuccess) {
          next(false)
          this.$vux.alert.show({
            title: '提示',
            content: '客户已签名确认，不能返回修改'
          })
        } else {
          next()
        }
      })
    },
    created () {
      this.chain(this.fetchData, this.initData)
      if (this.inApp) {
        this.setMenuBar()
      }
    },
    methods: {
      fetch,
      toast,
      chain,
      fetchData () {
        return this.fetch(API.SIGN.LOAD, {applyId: this.applyId})
      },
      initData (value) {
        const {caModel, payDTO, uploadImageModel, taxInfo} = value || {}
        this.caInfo = caModel || {}
        this.payInfo = payDTO || {}
        this.uploadInfo = uploadImageModel || {}
        this.taxInfo = taxInfo || {}
        this.isAirSignSuccess = caModel.isAirSignSuccess
        this.ready = true
        return value
      },
      // 设置菜单栏（标题右边的按钮）
      setMenuBar () {
        if (!this.canAir) {
          window.toggleMenu(2, false)
          return
        }
        window.goAirSign = () => {
          const activeInput = document.querySelector('input:focus')
          if (activeInput) {
            activeInput.blur()
          }
          this.$nextTick(() => {
            this.goAirSign()
          })
        }
        window.rightMenu({
          title: '空中签名',
          javascript: 'goAirSign'
        })
        window.toggleMenu(2, true)
      },
      // 代理人签名的promise函数，如果未签则rejected
      agentSignGuard () {
        return new Promise((resolve, reject) => {
          if (this.agentSignImgPath !== null) {
            resolve()
          } else {
            this.confirm({
              content: '代理人签名后方可空中签名',
              onCancel: reject,
              onConfirm: () => {
                this.gather(this.agentSignInfo).then(resolve, reject)
              }
            })
          }
        })
      },
      // 去空中签名
      goAirSign () {
        this.agentSignGuard()
          .then(() => this.cacheCaInfo(), null)
          .then(() => this.savePayInfo({saveType: false}), toast)
          .then(() => this.loadAirSignInfo(), toast)
          .then(value => this.openSharePanel(value), toast)
      },
      // 获取空中签名信息
      loadAirSignInfo () {
        const {applyId} = this
        return this.fetch(INFO_SHARE_SIGNATURE, {applyId})
      },
      // 打开分享面板（由native提供）
      openSharePanel (shareInfo) {
        const {icon, title, remark, url} = shareInfo
        // 只要打开面板，就会再临时绑定(每点击分享一次，就会执行一次)
        window.addEventListener('visibilitychange', this.backProgressAfterShare)
        window.showShare('2', url, icon, title, remark).then(json => {
          let info = JSON.parse(json)
          if (info.resultCode == '0') {
            this.$router.push({name: 'progress'})
          } else {
            this.unlock() //  收回空中签名，取消保单锁定
          }
          // 点击分享，然后取消，这时该事件的监听应该移除
          window.removeEventListener('visibilitychange', this.backProgressAfterShare)
        })
        // 只要打开面板，就会再临时绑定(每点击分享一次，就会执行一次)
        window.addEventListener('visibilitychange', this.backProgressAfterShare)
      },
      // 分享成功后返回投保进度页。
      backProgressAfterShare () {
        if (!document.hidden && this.$router.currentRoute.path === '/sign') {
          this.$router.push({name: 'progressprocess'})
          window.removeEventListener('visibilitychange', this.backProgressAfterShare)
        }
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
        this.fetch(API.TAX.TOGGLE, payload).then(null, toast).catch(console.error)
      },
      //  收回空中签名
      unlock () {
        const {applyId} = this
        return this.fetch(DE_SIGN_AIR, {applyId}).then(null, this.toast)
      },
      // 在服务端缓存证件影音和其它资料
      cacheUploadInfo () {
        return this.fetch(API.SIGN.CACHE.UPLOAD, this.uploadInfo)
      },
      // 缓存CA信息
      cacheCaInfo () {
        return this.fetch(API.SIGN.CACHE.CA, this.caInfo)
      },
      updateCaInfo () {
        this.chain(this.cacheCaInfo)
      },
      updateUploadInfo () {
        this.chain(this.cacheUploadInfo)
      },
      // 删除保单
      deleteApply () {
        const {applyId} = this
        return this.fetch(DELETEAPPLY, {applyId})
      },
      // 验证手机验证码
      validateCode () {
        const templeteNo = 'HQAPP_001'
        const {verCode: content, mobile: phoneNo} = this
        return this.axios.post(SMSVERIFY, {phoneNo, content, templeteNo}).then(({data}) => {
          const {success, value, errorMsg, errorCode} = data
          if (success) {
            return Promise.resolve(value)
          }
          let msg = errorMsg || value.errMsg
          if (errorCode == 4) {
            this.sendCount++
          }
          if (this.sendCount >= 3) {
            msg = '验证码连续输错3次，本次投保作废'
            this.deleteApply().then(() => {
              this.$router.push({path: '/progressprocess'})
            })
          }
          return Promise.reject(msg)
        })
      },
      validatePayInfo () {
        const {validation} = this
        return validation.length ? Promise.reject(validation[0].msg) : Promise.resolve()
      },
      gather (model) {
        const {certNo, keyWordRule, title, cType} = model
        const serialized = JSON.stringify({...keyWordRule, certNo})
        return window.caSign(title, cType, serialized).then(result => {
          const res = JSON.parse(result)
          switch (cType) {
            case 1:
              model.signImgPath = res.gestureImage // 签名 url
              return Promise.resolve(model)
            case 2:
              model.photoPath = res.captureImage // 拍照url
              return Promise.resolve(model)
            case 3:
              if (res.IDRecognizeResult === '0') { // failed
                this.faceFlag = "1"
              }
              model.photoPath = res.gestureImage // 人脸识别url
              return Promise.resolve(model)
          }
        })
      },
      // 通过横琴接口发送手机验证码
      send () {
        const {mobile, applyId} = this
        return this.fetch(API.CODE_VERIFY.SEND, {phoneNo: mobile, applyId})
          .then(value => {
            this.countModel.on = true
            return Promise.resolve(value)
          })
      },
      // 校验支付信息，通过时向服务器端发送请求，让它向用户发验证短信
      sendMessage () {
        if (!this.validate(['multipleRecordVerify', 'checkTerms', 'checkTaxInfo', 'uploaded'])) {
          return
        }
        return this.validatePayInfo()
          .then(this.savePayInfo)
          .then(this.send)
          .then(null, toast)
      },
      onValidation (arr) {
        this.$set(this, 'validation', arr)
      },
      // 确认电子签名（开始提交流程）
      confirmSign () {
        if (!this.validate()) return
        this.submitDisabled = true
        this.chain(
          this.validatePayInfo,
          this.savePayInfo,
          this.saveApplyInfo,
          this.submit
        ).finally(() => {
          this.submitDisabled = false
        })
      },
      // 保存保单信息（所有信息）
      saveApplyInfo () {
        const applyInfo = {
          applyId: this.applyId,
          payDTO: clone(this.payInfo),
          uploadImageModel: clone(this.uploadInfo),
          caModel: clone(this.caInfo),
          taxInfo: clone(this.taxInfo)
        }
        return this.fetch(SIGN_E_SAVE, applyInfo)
      },
      cachePayInfo () {
        this.submitDisabled = true
        this.savePayInfo({saveType: false})
          .then(value => toast('暂存成功'), toast)
          .catch(console.error)
          .finally(() => {
            this.submitDisabled = false
          })
      },
      // 保存支付信息
      savePayInfo (buffer = {}) {
        return this.fetch(API.SIGN.CACHE.PAY, {...this.payInfo, ...buffer})
      },
      submit () {
        const {applyId} = this
        toast({text: '此过程可能持续时间较长，请耐心等待', time: 3000})
        return this.axios.post(API.SIGN.SUBMIT, {applyId, smsContent: this.verCode}, {timeout: 1e3 * 60 * 10}).then(({data: {success, value, errorMsg}}) => {
          if (success) {
            const {status} = value
            const {isNeedEmail} = this.caInfo
            const params = {...value, isNeedEmail}
            // 状态为2001（人工核保成功）时页面跳转
            if (status === 2001) {
              this.$router.push({ name: 'resultsucc', params })
              // 状态为2003（人工核保失败）时页面跳转
            } else if (status === 2003) {
              this.$router.push({ name: 'resultmanual', params })
              // 状态为10001（支付失败）时页面跳转
            } else if (status === 10001) {
              this.$router.push({ name: 'resultfail', params })
              // 状态为2004,10002时页面跳转中间状态页
            } else if (status === 2004 || status === 10002 || status === 10003 || status === 0) {
              this.$router.push({ name: 'resultwait', params })
              // 程序出错跳转页面
            } else if (status === 5001) {
              this.$router.push({ name: 'resultWaitMultiple', params })
            } else if (status === -1) {
              this.$router.push({ name: 'resultfailself', params })
            } else if (status === -100) {
              this.toast('投保失败')
            } else if (status === -999) {
              // 投保年龄发生变化
              this.alert({
                content: value.msg,
                onHide: () => {
                  this.$router.push({ path: 'progressprocess' })
                }
              })
            }
          }
          return success ? Promise.resolve(value) : Promise.reject(errorMsg)
        })
      },
      getCustomerTypeName (customerType) {
        return ({
          1: '投保人',
          2: '被保人',
          3: '受益人'
        })[customerType]
      },
      // 上传资料校验
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
      // 验证码校验, true表示通过
      codeVerify () {
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
      /**
       * 校验当前页面
       * 内部持有一个map，使用它来定义如何校验当前页面。 校验规则有顺序，校验不通过则不继续往下校验
       * map的key定义了要校验的项
       * map的value定义了校验的方式：
       * 1. value是函数，这个函数需要在当前vm中有定义，函数的返回值是true表示通过校验，false则表示该项没有通过校验
       * 2. value是字符串，需要当前value对应的key在vm的数据中有定义，使用该数据的值是否为真来表示校验结果。value在这里表示错误消息
       * @param [list] {Array} - 校验项的数组表示 如果为空默认校验全部
       */
      validate (list) {
        let map = {
          multipleRecordVerify: this.multipleRecordVerify,
          checkTerms: '请先阅读条款',
          checkTaxInfo: '请填写税收居民信息',
          uploaded: this.uploadVerify,
          verCode: '请验证手机号码',
          countVerify: this.countVerify,
          codeVerify: this.codeVerify
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
        if (!list) {
          list = Object.keys(map)
        }
        return list.every(verify)
      },
      alert (param) {
        this.$vux.alert.show({title: '提示', ...param})
      },
      confirm (param) {
        this.$vux.confirm.show({title: '提示', ...param})
      },
      // 更新双录
      updateDoubleRecords (hasDoubleRecords) {
        const payload = {
          applyId: this.applyId,
          changeType: '1',
          doubleInfo: {
            hasDoubleRecords
          }
        }
        this.fetch(API.DOUBLE_RECORD.TOGGLE, payload).then(null, toast).catch(console.error)
      },
      tips (msg) {
        this.$vux.alert.show({
          title: '说明',
          content: msg
        })
      }
    }
  }
</script>

<style lang=less>
  @import url("~@/assets/styles/page.less");
  @primaryColor: #5697ff;

  .page-sign-app {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f7f7f7;
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
    .group-switch {
      display: flex;
      background-color: white;
      justify-content: space-between;
      align-items: center;
      line-height: 25px;
      padding: 8px 15px;
    }
    .color-gray {
      color: #999;
    }

    .list-upload {
      background-color: #fff;
      padding-left:15px;
      list-style: none;

      > li {
        position: relative;
      }

      > li + li::before {
        .setTopLine()
      }

      li > .tips{
        padding: 15px 0;
        font-size: 11px;
        color: @primaryColor;
      }
    }
    .panel-terms {
      background-color: #f7f7f7;
      padding: 15px;
      display: flex;
      align-items: flex-start;
      color: #999;
      line-height: 24px;
      font-size: 15px;

      .checkbox {
        margin-top: 4px;
      }

      .clauses {
        flex: 1;
      }

      a{
        color: @btnBlue;
      }
    }
    .footer {
      display: flex;
      padding: 25px 7.5px;

      button {
        flex: 1;
        margin: 0 7.5px;
      }
    }
  }

</style>
