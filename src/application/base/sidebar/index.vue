<template>
  <div class="page-sidebar">
    <za-mask v-if="maskShow">
      <div class="wrapper">
        <div class="box-aside" @click="hide"></div>
        <div class="box">
          <div class="through">
            <div class="contentBox" v-for="(group, index) in stepGroups" :key="index">
              <step-list :group="group" @nav="hide"/>
            </div>
          </div>
          <div class="tab">
            <div class="home">
              <div class="bar">
                <div @click="gohome">
                  <img src="~@/assets/styles/images/side-home.png">
                  <div>首页</div>
                </div>
              </div>
            </div>
            <div class="schedule">
              <div class="bar">
                <div @click="goprogress">
                  <img src="~@/assets/styles/images/side-schedule.png">
                  <div>投保进度</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </za-mask>
    <div class="arrow-left-box" v-else>
      <div class="arrow-left" @click="show"></div>
    </div>
  </div>
</template>
<script>
  import stepList from './step-list'
  import StepTypes from 'src/data/StepTypes'
  import zaMask from 'src/components/za-mask'
  import store, {ACTION} from 'src/store'
  import {mapGetters} from 'vuex'

  export default {
    name: 'sidebar',
    components: {
      stepList,
      zaMask
    },
    data () {
      return {
        maskShow: false
      }
    },
    computed: {
      planId () {
        return this.$route.query.planId
      },
      stepGroups () {
        return store.getters.getStepGroups(this.planId)
      }
    },
    created () {
      const {planId, $route: route} = this
      store.dispatch(ACTION.MAINTAIN_STEPS, {planId, route}).then(null, console.error)
    },
    watch: {
      $route (to, from) {
        const {planId} = to.query
        store.dispatch(ACTION.MAINTAIN_STEPS, {planId, route: to}).then(null, console.error)
      }
    },
    methods: {
      goprogress () {
        this.$router.push({name:'progressprocess', query:{type: 3}})
      },
      gohome () {
        window.closeWebview(1)
      },
      show () {
        this.maskShow = true
      },
      hide () {
        this.maskShow = false
      }
    }
  }
</script>
<style lang="less">
  .page-sidebar {
    .wrapper {
      display: flex;
      height: 100%;
      .box-aside {
        flex: 1;
      }
      .box {
        display: flex;
        flex-direction: row-reverse;
        width: 160px;
        position: fixed;
        right: 0;
        height: 100%;
        .through {
          position: fixed;
          right: 0;
          top: 0;
          width: 160px;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          padding-top: 17.5px;
          box-sizing: border-box;
          .content {
            padding: 0 16px 0 15px;
          }
        }
        .tab {
          width: 160px;
          height: 50px;
          background: #000;
          display: flex;
          flex-direction: row;
          font-size: 15px;
          color: #bfbfbf;
          position: fixed;
          bottom: 0;
          right: 0;
          .home, .schedule {
            flex: 1;
            text-align: center;
            height: 100%;
            box-sizing: border-box;
            padding-top: 8px;
            div {
              font-size: 10px;
              img {
                height: 18px;
                width: 18px;
              }
            }
          }
          a {
            font-size: 10px;
            color: #bfbfbf;
            text-decoration: none;
          }
        }
      }
    }
    .arrow-left-box {
      position: fixed;
      top: 50%;
      right: 0%;
      margin: -20px 0 0 0;
      width: 20px;
      overflow-x: hidden;
      z-index: 999;
      .arrow-left {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        &:after {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 24px;
          content: ' ';
          display: block;
          width: 0;
          height: 0;
          border-top: 7px solid transparent;
          border-right: 9px solid #ffffff;
          border-bottom: 7px solid transparent;
        }
      }
    }
  }
</style>
