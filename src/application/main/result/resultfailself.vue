<!--********************************************************************
 * Author        : Geyan
 * Email         : geyan@zhongan.io
 * Last modified : 2017-04-07 17:37
 * Filename      : resultFailSelf.vue
 * Description   : e投保－查看投保结果－自核失败

********************************************************************-->

<template>
  <div class="rst-self-fail-content">
    <div v-if='show'>
      <div class="rst-self-fail">
        <p class="sf-icon-content"><img src="~@/assets/styles/images/result/sad.png"></p>
        <p>您的投保单提交遇到问题,</p>
        <p>请点击<span>重新提交</span>按钮后再尝试。</p>
      </div>
      <button class="sf-repay-btn" @click="onsubmit">重新提交</button>
    </div>
    <c_errMsg v-else txt="啊哦 ～～,抱歉当前无记录信息哦!"></c_errMsg>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {APPLYSUBMIT} from '@/api'
  export default {
    data: () => {
      return {
        show: true,
        resObjet: {
          msg: '',
          contNo: ''
        },
        applyId: ''
      }
    },
    name: 'resultfailself',
    props: [],
    created () {
      this.resObjet = this.$route.params
      this.applyId = this.$store.state.sale.applyId || this.$route.params.applyId
    },
    methods: {
      onsubmit () {
        this.axios.post(APPLYSUBMIT, {
          applyId: this.applyId
        }, {timeout: 180000}).then((response) => {
          if (response.data.success) {
            // response.data.value.status = '-999'
            this.status = response.data.value.status
            this.resObjet = {...this.resObjet, ...response.data.value}
            // 状态为2001（人工核保成功）时页面跳转
            if (this.status == '2001') {
              this.$router.push({name: 'resultsucc', params: this.resObjet})
              // 状态为2003（人工核保失败）时页面跳转
            } else if (this.status == '2003') {
              this.$router.push({name: 'resultmanual', params: this.resObjet})
              // 状态为10001（支付失败）时页面跳转
            } else if (this.status == '10001') {
              this.$router.push({name: 'resultfail', params: this.resObjet})
              // 状态为2004,10002时页面跳转中间状态页
            } else if (this.status == '2004' || this.status == '10002' || this.status == '0') {
              this.$router.push({name: 'resultwait', params: this.resObjet})
              // 程序出错跳转页面
            } else if (this.status == '-1') {
              this.$router.push({name: 'resultfailself', params: this.resObjet})
            } else if (this.status == '-999') {
              // 投保年龄发生变化
              this.showConfirm(response.data.value.msg)
            }
          } else {
            this.$vux.toast.show({
              text: response.data.errorMsg,
              type: 'text',
              width: '50%',
              isShowMask: true
            })
          }
        }).catch((err) => {
          console.log(err)
          throw new Error(err)
        })
      },
      showConfirm (txt) {
        let _this = this
        this.$vux.alert.show({
          title: '提示',
          content: txt,
          onShow () { },
          onHide () {
            _this.$router.push({ path: '/progressprocess' })
          }
        })
      }
    }
  }
</script>

<style lang="less">

  .rst-self-fail-content {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    text-align: center;
    background-color: #f7f7f7;
    .rst-self-fail {
      padding-top: (50px);
      background-color: #fff;
      padding-bottom: (50px);
      margin-bottom: (26px);
      p {
        text-align: center;
      }
      .sf-icon-content {
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
        span {
          color: #00adff;
        }
      }
    }
    .sf-repay-btn {
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
