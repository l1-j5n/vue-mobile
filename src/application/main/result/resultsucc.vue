
<!--********************************************************************
 * Author			: Geyan
 * Email			: geyan@zhongan.io
 * Last modified	: 2017-04-07 13:35
 * Filename			: resultSucc.vue
 * Description		: e投保－查看投保结果－成功

********************************************************************-->

<template>
  <div class="rst-succ-content">
    <div v-if='show'>
      <div class="rst-succ">
        <p class="succ-icon-content"><img src="~@/assets/styles/images/result/succ.png"></p>
        <p>恭喜您投保成功</p>
        <!--<p>您的保险合同编号为{{resObjet.contNo}},保险合同生效日期为{{resObjet.startTime}}。</p>-->
        <p>{{resObjet.msg}}</p>
        <p class="succ-tip" v-if="resObjet.isNeedEmail=='Y'">温馨提示: 电子保单将发送到您的电子邮箱,请注意查收。</p>
        <!--{{resObjet.isNeedEmail}}-->
      </div>
    </div>
    <c_errMsg  v-else txt = "啊哦 ～～,抱歉当前无记录信息哦!"></c_errMsg>
  </div>
</template>

<script>
  import {IRESULTSUCC} from '@/api'
  export default {
    name: 'resultsucc',
    data: () => {
      return {
        show: true,
        contractId: '',
        startTime: '',
        resObjet: {
          msg: '',
          contNo: '',
          isNeedEmail: ''
        }
      }
    },
    created () {
      this.resObjet = this.$route.params
      console.log(this.resObject)
    },
    methods: {
      getData () {
        let self = this
        this.axios.get(IRESULTSUCC, {}).then((response) => {
          this.contractId = response.data.contractid
          this.startTime = response.data.starttime
          self.show = true
        }).catch((err) => {
          console.log(err)
          self.show = false
          throw new Error(err)
        })
      }
    }
  }
</script>

<style lang="less">
  .rst-succ-content {
    position:absolute;
    width:100%;
    height:100%;
    text-align:center;
    background-color:#f7f7f7;
    .rst-succ {
      padding-top:(50px);
      background-color:#fff;
      padding-bottom:(50px);
      margin-bottom:(26px);
      p {
        text-align:center;
        word-break: break-all;
      }
      .succ-icon-content {
        height:(46px);
        margin-bottom:(22px);
        text-align:center;
        img {
          height:100%;
        }
      }
      & p:nth-child(2) {
        font-size:(18px);
        margin-bottom:(24px);
      }
      & p:nth-child(3) {
        font-size:(15px);
        color:#666;
        line-height:(28px);
        padding-left:(10px);
        padding-right:(10px);
        margin-bottom:(11px);
      }
      .succ-tip {
        color:#00aeff;
      }
    }
  }

</style>
