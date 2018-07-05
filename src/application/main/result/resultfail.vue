<!--********************************************************************
 * Author        : Geyan
 * Email         : geyan@zhongan.io
 * Last modified : 2017-04-07 17:36
 * Filename      : resultFail.vue
 * Description   : e投保－查看投保结果－支付失败

********************************************************************-->

<template>
  <div class="rst-fail-content">
    <div v-if='show'>
      <div class="rst-fail">
        <p class="fail-icon-content"><img src="~@/assets/styles/images/result/sad.png"></p>
        <p>啊哦 ~ ~, 支付遇到问题,</p>
        <p>请核实后, 再进行支付。</p>
        <p>问题描述: {{resObjet.msg}}</p>
      </div>
      <button class="fail-repay-btn" @click="onRePay">重新支付</button>
    </div>
    <c_errMsg v-else txt="啊哦 ～～,抱歉当前无记录信息哦!"></c_errMsg>
  </div>
</template>

<script>
  import {IRESULTFAIL} from '@/api'
  export default {
    name: 'resultFail',
    data: () => {
      return {
        show: true,
        applyId: '',
        resObjet: {
          msg: '',
          contNo: ''
        }
      }
    },
    created () {
      this.resObjet = this.$route.params
      this.applyId = this.$store.state.sale.applyId || this.$route.params.applyId
    },
    methods: {
      onRePay () {
        this.$router.push({path: '/web/repay', query: {applyId: this.applyId}})
      }
    }
  }
</script>

<style lang="less">

  .rst-fail-content {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #f7f7f7;
    .rst-fail {
      padding-top: (50px);
      background-color: #fff;
      padding-bottom: (54px);
      margin-bottom: (26px);
      p {
        text-align: center;
      }
      .fail-icon-content {
        height: (46px);
        margin-bottom: (22px);
        text-align: center;
        img {
          height: 100%;
        }
      }
      & p:nth-child(2) {
        font-size: (19px);
        margin-bottom: (8px);
      }
      & p:nth-child(3) {
        font-size: (19px);
        margin-bottom: (30px);
      }
      & p:nth-child(4) {
        font-size: (15px);
        color: #666;
      }
    }
    .fail-repay-btn {
      font-size: 16px;
      background-color: #00aeff;
      border-radius: 4px;
      color: #fff;
      border: none;
      width: (350px);
      height: (46px);
    }
  }

</style>
