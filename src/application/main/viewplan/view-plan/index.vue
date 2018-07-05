<template>
  <div class="container">

    <!-- <header>
      <div>
        header
      </div>
    </header> -->

    <view-plan></view-plan>

    <footer>
      <div class="flex">
        <button class="weui-btn weui-btn_plain-primary" @click="shareBtn"> 分享 </button>
        <div class="btn-next" @click="_next">
          <span v-if="inApp">制作投保书</span>
          <span v-else>制作建议书</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
import ViewPlan from "./viewPlan";
import {mapActions} from 'vuex'
import store, {ACTION} from 'src/store'
import { VIEWPLAN, MOREINSURESHOWBENEFITCOVERAGE, SHAREPROPOSAL } from "@/api"
import {mapGetters} from 'vuex'
export default {
  components: {
    ViewPlan
  },
  computed: {
    ...mapGetters(['inApp'])
  },
  methods: {
    shareBtn() {
      const { planId } = this.$route.query;
      if (this.source === "e投保") {
        this.eShare();
        return;
      }
      if (this.inApp) {
        this.axios
          .post(SHAREPROPOSAL, { planId })
          .then(
            ({ data }) => {
              if (data.success) {
                const value = data.value;
                window.showShare(
                  "2;3",
                  value.url,
                  value.coverPath,
                  value.title,
                  value.remark,
                  "shareCallback"
                );
              } else {
                this.__toast(data.errorMsg);
              }
            },
            fail => {}
          )
          .catch(err => {
            // console.log(err);
            throw new Error(err);
          });
      }
    },
    // e投保分享
    eShare() {
      const { planId } = this.$route.query;
      this.axios
        .post(SHAREPROPOSAL, { planId })
        .then(({ data }) => {
          if (data.success) {
            const value = data.value;
            window.showShare(
              "2;3",
              value.url,
              value.coverPath,
              value.title,
              value.remark,
              "shareCallback"
            );
          } else {
            this.__toast(response.data.errorMsg);
          }
        }, toast)
        .catch(console.error);
    },
    _next() {
      let result = true;
      for (let i of app.viewPlan_next) {
        if (i == false) {
          result = false;
          break;
        }
      }

      const {query, query: {planId}, name: routeName} = this.$route

      if (result) {
        let {planId, insureId, planType} = this.$route.query
        if(!this.inApp || planType === 'sharePlan') {
          this.$router.push({
            name: 'insure-add-user',
            query: {
              planId,
              insureId
            }
          })
        } else {
          // 动态的下一步
          // 删除掉planType标识
          delete query.planType
          store.dispatch(ACTION.GET_ROUTE_NEXT, {planId, route: this.$route}).then(nextRoute => {
            this.$router.push({...nextRoute, query})
          })
        }
      } else {
        this.$vux.toast.show({ text: "你还没有都勾选" });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/page.less";
.container {
  * {
    box-sizing: border-box;
  }
  padding-bottom: 0;

  background: @titleBg;


  #userInfo {

    .info-header {
      width: 100%;
      height: 43px;
      line-height: 43px;
      // background-color: @titleBg;
      font-size: 17px;
      padding: 0 15px;
    }

    .info-line {
      background: @white;
      border: 1px solid @weuiLineColorApplicant;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      padding: 15px;
      margin-bottom: 10px;
      & > p {
        margin-bottom: 10px;
      }
      // padding-bottom: 25px;
      // margin-bottom: 10px;
      // box-shadow: 0 -10px 10px 10px #f3f3f3;
    }
    // .矩形_4 {
    //   background-color: rgb( 255, 255, 255 );
    //   position: absolute;
    //   left: -2px;
    //   top: 597px;
    //   width: 754px;
    //   height: 376px;
    //   z-index: 242;
    // }

    .info-item {
      border-radius: 8px;
      padding: 20px 0;
      display: flex;
      background: @weuiLineColorApplicant;
      width: 100%;
      span {
        flex: 1;
        border-right: 1px solid rgb(225, 225, 225);
        justify-content: center;
        align-items: center;
        flex-direction: column;
        display: flex;
        .info_ico {
          height: 30px;
          width: 30px;
          margin-bottom: 5px;
        }
        .info_ico_name {
          background: url(~@/assets/styles/images/name@2x.png) no-repeat;
          background-size: 100% 100%;
        }
        .info_ico_sex {
          background: url(~@/assets/styles/images/sex@2x.png) no-repeat;
          background-size: 100% 100%;
        }
        .info_ico_age {
          background: url(~@/assets/styles/images/age@2x.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      & span:last-child {
        border-right: none;
      }
    }

    .product-info {
      border-bottom: none;
      // & > div {
      //   margin: 0 8px;
      // }
      .charge-total {
        text-align: right;
        padding-right: 17px;
        margin-top: 17px;
      }
    }

    .info-title {
      line-height: 47px;
      width: 360px;
      margin: 0 auto;
      color: #00aeff;
      text-align: center;
      font-size: 16px;
      font-weight: normal;
    }
    .own-title {
      margin-top: 10;
      padding: 0 15;
      margin: 10px 8px;
      font-size: 15px;
      font-weight: normal;
    }
    .own-explain {
      padding: 0 15px;
      margin-bottom: 15px;
      font-size: 13px;
      line-height: 25px;
      color: #999;
    }

    .suggest-guide {
      position: static;
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 99;
      width: 100%;
      border-bottom: 1px solid #d0d0d0;
      margin-bottom: 9px;
      .vux-tab-selected {
        color: #00b1ff !important;
        border-bottom: 2px solid #00b1ff !important;
      }
      .vux-tab-ink-bar {
        background-color: #00b1ff !important;
        height: 1px !important;
      }
      .vux-tab-item {
        background: none !important;
      }
    }

    .suggtable {
      width: 100%;
      td,
      th {
        // border: 1px solid rgba(187, 187, 187, 1);
        text-align: center;
        padding: 10px;
      }
      th {
        background-color: #c3c3c3;
        color: rgba(255, 255, 255, 1);
        // border: 1px solid rgba(187, 187, 187, 1);
        text-align: center;
        &:first-child {
          width: 60%;
        }
      }
      td {
        background: #f8f8f8;
        color: #666666;
      }
    }

    .suggest-user-own {
      padding: 15px;
      .product-title {
        font-weight: bold;
        padding-left: 8;
        margin: 0 8px;
        font-size: 18px;
      }
      .content2_line {
        margin: 10px 8px;
        border-bottom: 1px solid #f0eff5;
        &:last-child {
          font-size: 100px;
        }
      }
      .body {
        background: @white;
        .pdf {
          padding: 10px 8px;
          a {
            color: #5697ff;
            font-size: 12px;
          }
        }
      }
      /*font-weight:bold;*/
      .own-life {
        .life-title {
          color: #666666;
          position: relative;
          margin: 12 0;
          padding: 10px 0;
          font-size: 15px;
          padding-left: 21px;
          span {
            font-size: 12px;
          }
          &:before {
            content: "";
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #00aeff;
            left: 8px;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        }
        & > p {
          font-size: 10px;
          margin: 10px 0;
          color: #9f9f9f;
        }
      }
      .own-comments {
        color: #999;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 11px;
        margin-top: 13px;
        line-height: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f0f0f0;
      }
      .own-contract {
        padding-left: 8px;
        padding-right: 8px;
        margin-top: 19px;
        p {
          font-size: 13px;
          color: #999;
          line-height: 24px;
          span {
            color: #00aeff;
          }
        }
      }
    }

    .dec {
      margin: 0 15px;
    }

    .dec-confirm {
      line-height: 20px;
      height: 20px;
      min-height: 20px;
      font-size: 15px;
      color: #999999;
      /*font-weight:bold;*/
      padding-left: 32px;
      background: url(~@/assets/styles/images/checke.png) no-repeat;
      background-size: 20px 20px;
      /*<!--background-position:0 -33.5px;-->*/
    }
    .dec-confirm.checked {
      line-height: 20px;
      height: 20px;
      font-size: 15px;
      color: #00aeff;
      /*font-weight:bold;*/
      padding-left: 32px;
      background: url(~@/assets/styles/images/checked.png) no-repeat;
      background-size: 20px;
    }
  }

  footer {
    margin-top: 20px;
    .flex {
      display: flex;
      text-align: center;
      & > * {
        width: 50%;
        margin: 10px;
      }
      .btn-next {
        position: relative;
      }
    }
  }
}
</style>
