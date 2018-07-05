<!-- 投保结果 -->
<template>
  <div class="page-result-share">
    <div class="main-tip" v-if="ready">
      <template v-if="type==='success'">
        <r-icon name="success"/>
        <h2>恭喜您投保成功</h2>
        <p>{{info.msg}}</p>
        <p v-if="info.isNeedEmail">温馨提示: 电子保单将发送到您的电子邮箱,请注意查收。</p>
      </template>
      <template v-else-if="type==='fail[manual]'">
        <r-icon name="hourglass" class="limit-height"/>
        <p>您的投保单将进一步进行人工核保,</p>
        <p>请关注人工核保结果, 谢谢!</p>
        <p>您的投保单号为<strong>{{info.contNo}}</strong>。</p>
      </template>
      <template v-else-if="type==='fail[pay]'">
        <r-icon name="smile" />
        <h2>啊哦 ~ ~, 支付遇到问题,</h2>
        <p>请核实后, 再进行支付。</p>
        <p>问题描述: {{info.msg}}</p>
        <p>请联系代理人，重新发起支付。</p>
      </template>
      <template v-else-if="type==='wait'">
        <r-icon name="hourglass" class="limit-height"/>
        <p>{{info.msg}}</p>
        <p>您的投保单号为<strong>{{info.contNo}}</strong>。</p>
      </template>
      <template v-else-if="type==='changed[age]'">
        <r-icon name="hourglass" class="limit-height"/>
        <p>{{info.msg}}</p>
        <p>您的投保单号为<strong>{{info.contNo}}</strong>。</p>
        <p>投保年龄发生变化请联系代理人。</p>
      </template>
      <template v-else-if="type==='wait[multiple]'">
        <r-icon name="hourglass" class="limit-height"/>
        <p>您的投保单：</p>
        <p v-for="(action, contNo) in info.subJson" :key="contNo"><strong>{{contNo}}</strong>将进行{{action}}</p>
        <p>请关注投保结果，谢谢！</p>
        <p class="manual-contract">您的总投保单为<strong>{{info.sourceApplyNo}}</strong>。</p>
      </template>
      <template v-else>
        <r-icon name="smile"/>
        <p>您的投保单提交遇到问题,</p>
        <p>请点击重新提交。</p>
        <footer>
          <r-btn primary block @click="recommit">重新提交</r-btn>
        </footer>
      </template>
    </div>
    <div v-else>
      <template v-if="repeat > 0">
        <p>正在获取投保结果...</p>
        <p v-if="repeat < 20">正在刷新第{{20 - repeat}}次</p>
      </template>
      <p v-if="repeat === 0">暂无投保结果</p>
    </div>
  </div>
</template>
<script>
  import {RIcon, RBtn} from 'src/components'
  import API from  'src/api'
  import {fetch, toast} from 'src'

  const statusArray = [
    {
      type: 'success',
      status: 2001 // 人工核保成功 2001
    }, {
      type: 'fail[manual]',
      status: 2003 // 人工核保失败 2003
    }, {
      type: 'fail[pay]',
      status: 10001 // 支付失败 10001
    }, {
      type: 'wait',
      status: [0, 2004, 10002, 10003] // 页面跳转中间状态页
    }, {
      type: 'wait[multiple]', // 多主险时有险种不满足要求需要人核
      status: [5001]
    }, {
      type: 'error',
      status: -1 // 程序出错跳转页面
    }, {
      type: 'changed[age]',
      status: -999 // 投保年龄发生变化
    }
  ]

  export default {
    name: 'cover',
    components: {
      RIcon, RBtn
    },
    data () {
      return {
        repeat: 20,
        ready: false,
        status: null,
        info: {},
        type: null
      }
    },
    computed: {
      applyId () {
        return this.$route.query.applyId
      }
    },
    created () {
      this.loadData().then(this.initData).then(null, toast)
    },
    methods: {
      loadData () {
        return fetch(API.APPLY.STATUS, {applyId: this.applyId})
      },
      initData (value) {
        const {status} = value
        if (status === 1000) {
          return this.repeatable()
            .then(() => this.defer(5000))
            .then(this.loadData)
            .then(this.initData)
        } else {
          const item = statusArray.find(item => {
            return Array.isArray(item.status) ? item.status.includes(status) : item.status === status
          }) || {}
          this.type = item.type
          this.ready = true
        }
      },
      repeatable () {
        return new Promise((resolve, reject) => {
          let {repeat} = this
          repeat--
          this.repeat = repeat
          return repeat > 0 ? resolve() : reject('暂时无法获取投保结果')
        })

      },
      defer (ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms)
        })
      },
      recommit () {
        //
      }
    }
  }
</script>
<style lang='less'>
  .page-result-share {
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #f7f7f7;
    overflow-x: hidden;
    overflow-y: auto;

    .main-tip{
      min-height: 48.14%;
      background-color: white;
      padding-top: 10%;
      box-sizing: border-box;
    }
    img {
      display: block;
      max-width: 60px;
      margin: 10px auto 30px;
    }
    .limit-height {
      height: 46px;
    }
    h2{
      font-weight: normal;
      line-height: 40px;
      margin: 10px;
      font-size: 20px;
      color: #333;
    }
    strong{
      font-weight: normal;
      color: #00aeff;
    }
    p {
      padding-left: 5px;
      padding-right: 5px;
      font-size: 16px;
      margin: 10px 0;
      line-height: 20px;
      color:#bcbcbc;
      word-break: break-all;
    }
    footer{
      margin-top: 40px;
      padding: 0 15px;
    }
  }
</style>
