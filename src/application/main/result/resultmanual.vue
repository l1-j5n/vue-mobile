<!--********************************************************************
 * Author			: Geyan
 * Email			: geyan@zhongan.io
 * Last modified	: 2017-04-07 13:37
 * Filename			: resultManual.vue
 * Description		: e投保－查看投保结果－人工核保

********************************************************************-->

<template>
  <div class="rst-manual-content">
    <div v-if='show'>
      <div class="rst-manual">
        <p class="manual-icon-content"><img src="~@/assets/styles/images/result/sand_box.png"></p>
        <p>您的投保单将进一步进行人工核保,</p>
        <p>请关注人工核保结果, 谢谢!</p>
        <p class="manual-contract">您的投保单号为<span>{{resObjet.contNo}}</span>。</p>
        <div class="manual-rule-content">
          <h5>自核不通过规则如下:</h5>
          <p>{{resObjet.msg}}</p>
        </div>
      </div>
      <!--<button class="manual-repay-btn" @click="repay">重新支付</button>-->
    </div>
    <c_errMsg v-else txt="啊哦 ～～,抱歉当前无记录信息哦!"></c_errMsg>
  </div>
</template>

<script>
  import {IRESULTMANUAL} from '@/api'
  export default {
    name: 'resultmanual',
    data: () => {
      return {
        show: true,
        contractId: '',
        repayUrl: '',
        resObjet: {
          msg: '',
          contNo: ''
        },
        applyId: ''
      }
    },
    created () {
      this.resObjet = this.$route.params
      this.applyId = this.$store.state.sale.applyId || this.$route.params.applyId
    },
    methods: {
      repay () {
        this.$router.push({path: '/web/repay', query: {applyId: this.applyId}})
      }
    }
  }
</script>

<style lang="less" >

  .rst-manual-content {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #f7f7f7;
    .rst-manual {
      padding-top: (50px);
      background-color: #fff;
      margin-bottom: (26px);
      p {
        text-align: center;
      }
      .manual-icon-content {
        height: (46px);
        margin-bottom: (22px);
        text-align: center;
        img {
          height: 100%;
        }
      }
      & p:nth-child(2) {
        font-size: (18px);
        margin-bottom: (8px);
      }
      & p:nth-child(3) {
        font-size: (19px);
        margin-bottom: (30px);
      }
      .manual-contract {
        font-size: (15px);
        span {
          color: #00aeff;
        }
      }
      .manual-rule-content {
        border-top: 1px solid #efefef;
        margin-top: (25px);
        padding: (20px) (15px);
        color: #999;
        h5 {
          text-align: left;
          font-weight: normal;
          font-size: (12px);
          margin-bottom: (10px);
        }
        p {
          text-align: left;
          font-size: (12px);
          margin: 0;
          line-height: (20px);
        }
      }
    }
    .manual-repay-btn {
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
