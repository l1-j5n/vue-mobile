<!--
  结果等待页 status 5001
 -->
<template>
  <div class="page-result-wait-multiple">
    <div class="rst-manual">
      <p class="manual-icon-content"><img src="~@/assets/styles/images/result/sand_box.png"></p>
      <div class="description">
        <p>您的投保单：</p>
        <p v-for="(action, contNo) in info.subJson" :key="contNo"><strong>{{contNo}}</strong>将进行{{action}}</p>
        <p>请关注投保结果，谢谢！</p>
        <p class="manual-contract">您的总投保单为<strong>{{info.sourceApplyNo}}</strong>。</p>
      </div>
      <div class="manual-rule-content" v-if="showRules">
        <h5>自核不通过规则如下:</h5>
        <p v-for="(msg, index) in info.ruleMsg" :key="index">{{msg}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'resultWaitMultiple',
    data () {
      return {
        info: {
          subJson: {},
          ruleMsg: [],
          sourceApplyNo: ''
        }
      }
    },
    created () {
      this.info = this.$route.params
    },
    computed: {
      showRules () {
        const rules = this.info.ruleMsg
        return Array.isArray(rules) && rules.length > 0
      }
    }
  }
</script>

<style lang="less">

  .page-result-wait-multiple {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #f7f7f7;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    overflow-y: auto;
    .rst-manual {
      padding-top: (50);
      background-color: #fff;
    }
    .manual-icon-content {
      height: (46px);
      margin-bottom: (22px);
      text-align: center;
      img {
        height: 100%;
      }
    }
    .description{
      padding-bottom: (10);
      p {
        text-align: center;
        line-height: (28);
        font-size: (17);
        word-break: break-all;
      }
      strong {
        font-weight: normal;
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
</style>
