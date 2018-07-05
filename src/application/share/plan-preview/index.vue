<template>
  <div class="container">

    <!-- <header>
      <div>
        header
      </div>
    </header> -->
    
    <div class="modal" v-if="modal">
      <img src="~@/assets/styles/images/sign/dele.png" alt="" style="display:inline-block;widht:25px;" @click="modal = !modal">
      <user></user>
    </div>
    <div class="modal2" v-if="modal2">
      <div class="modal_header">
        <span @click="modal2 = !modal2">取消</span>
        <span @click="submit">提交预约</span>
      </div>
      <div class="modal_content">
        <div class="modal_content_title">请输入以下信息，营销员会在第一时间联系您哦～</div>
        <div class="form-unit">
          <div class="form-row">
            <div class="baseBox">
              <div class="main">
                <!-- <div class="baseBoxLeft">
                  <label for="" class="input-label"></label>
                </div> -->
                <div class="baseBoxright">
                  <input placeholder="请输入您的姓名" maxlength="11" type="text" name="mobile" class="rootInput is-danger" v-model="userInfo.name">
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="baseBox">
              <div class="main">
                <!-- <div class="baseBoxLeft">
                  <label for="" class="input-label"></label>
                </div> -->
                <div class="baseBoxright">
                  <input placeholder="请输入您的电话" maxlength="11" type="tel" name="mobile" class="rootInput is-danger" v-model="userInfo.mobile">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <view-plan></view-plan>

    <footer>
      <div class="flex">
        <div class="flex">
          <div class="flex">
            <img src="~@/assets/styles/images/add-plan.png" alt="" @click="addPlan">
            <span>增加计划书</span>
          </div>
          <div class="flex" @click="modal = !modal">
            <img src="~@/assets/styles/images/marketing-card.png" alt="">
            <span>营销员名片</span>
          </div>
        </div>
        <div class="btn-next" @click="Reservations">预约投保</div>
      </div>
    </footer>




  </div>
</template>

<script>
import ViewPlan from "../../main/viewplan/view-plan/viewPlan.vue";
import User from "../../base/user/main.vue";
import { SAVEAPPOINTMENT } from "@/api"
import {mapActions} from 'vuex'
import store, {ACTION} from 'src/store'

let data = {
  modal: false,
  modal2: false,
  userInfo: {
    "name": '',
    "mobile": "",
    "planTypeFlag": "sharePlan",
    "staffNo": "1440010223",
    "planId": "1062010354018662"
  }
};
export default {
  data() {
    return data;
  },
  components: {
    ViewPlan,
    User
  },
  updated() {
    let _this = this;
    this.$nextTick(function() {
      // window.addEventListener("scroll", winScroll);

      let arr = [];

      let refs = this.$refs.benefits;
      let tab_select = this.$refs.tab_select;
      let len = refs && refs.length;

      for (let i = 0; i < len; i++) {
        arr[i] = refs[i].offsetTop;
      }

      function winScroll(e) {
        arr.map((item, index) => {
          let sTop =
            document.body.scrollTop + document.documentElement.scrollTop;
          // console.log(`当前scroll:${sTop}`,`当前循环scroll:${item}`,`当前循环下一个scroll:${(arr[index+1] || 100000)}`,`当前tab值:${_this.selected}`,index)
          //当前循环scroll:742 当前scroll:100 当前循环下一个scroll:3786 当前tab值:0 0
          if (
            sTop >= item - 45 &&
            sTop < (arr[index + 1] - 45 || 100000) &&
            _this.selected !== index
          ) {
            _this.selected = index;
            // tab_select[index].$el.click();
          }
        });
      }
    });
  },
  computed: {
  },
  methods: {
    addPlan() {
      let {planId, insureId} = this.$route.query
      this.$router.push({path: '/adduser', query: {planId, insureId}})
    },
    Reservations() {
      this.modal2 = !this.modal2
    },
    submit() {
      let {planId, insureId} = this.$route.query
      this.userInfo.planId = planId
      this.axios
          .post(SAVEAPPOINTMENT, this.userInfo)
          .then(res => {
            if(res.data.success) {
              this.__toast(res.data.errorMsg);
            } else {
              this.__toast(res.data.errorMsg);
            }
          })
    }
  },
  created() {
  }
};
</script>

<style>
* {
  margin: 0;
}
.flex {
  display: flex;
}
</style>
<style lang="less" scoped>
@import "../../../assets/styles/page.less";
.container {
  background: #f7f7f7;
}
.modal {
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,0.2);
  z-index: 999;
  img {
    position: fixed;
    top: 10px;
    right: 10px;
    display: inline-block;
    width: 25px;
  }
}
.modal2 {
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 501;
  transition-property: -webkit-transform;
  transition-property: transform;
  transition-property: transform,-webkit-transform;
  transition-duration: .3s;
  max-height: 100%;
  overflow-y: scroll;
  .modal_header {
    height: 50px;
    line-height: 50px;
    color: #11aeff;
    font-size: 14px;
    padding: 0 10px;
    border-bottom: 1px solid #f0f0f0;
    & > span:last-child {
      float: right;
    }
  }
  .modal_content {
    padding: 0 30px 40px 30px;
    .modal_content_title {
      padding: 30px 0;
    }
    
    .form-row {
        margin: 0;
        padding: 0;
        list-style: none;
        min-height: 3.21429rem;
        line-height: 3.21429rem;
        vertical-align: middle;
        position: relative;
        font-size: 1.14286rem;
        overflow: hidden;
        clear: both;
        .baseBox {
            border-bottom: 1px solid #f0f0f0;
            box-sizing: border-box;
            .main {
                min-height: 45px;
                line-height: 45px;
                padding-top: 1px;
                padding-bottom: 1px;
                display: flex;
                .baseBoxright {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    .rootInput {
                        font-size: 16px;
                        text-align: left;
                        flex: 1;
                        display: flex;
                        margin: 0 0 3px 0;
                        padding-right: 15px;
                        border: 0;
                        outline: none;
                        color: #333;
                    }
                }
            }
        }
    }
  }
}
footer {
  height: 50px;
  background: @white;
  margin-top: 20px;
  & > .flex {
    height: 100%;
    display: flex;
    text-align: center;
    & > *:first-child {
      display: flex;
      align-items: center;
      height: 100%;
      width: 60%;
      & > *{
        flex: 1;
        flex-direction: column;
        align-items: center;
        img {
          width: 25px;
        }
      }
    }
    & > *:last-child {
      height: 100%;
      line-height: 50px;
      width: 40%;
    }
    .btn-next {
      position: relative;
    }
  }
}
</style>

