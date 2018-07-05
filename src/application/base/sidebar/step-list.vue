<template>
  <div class="component-step-list">
    <h4 :class="[group.steps && (expanded ? 'arrow-up' : 'arrow-down'), {active: !group.steps && isActive(group.step)}]"
        @click="onClickTitle">{{group.name}}</h4>
    <template v-if="group.steps">
      <div class="list" v-show="expanded">
        <template v-for="(step, index) in group.steps">
          <a :class="{active: isActive(step)}" :key="index" @click="nav(step)">{{step.title}}</a>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
  import {findStep} from 'src/service/stepService'

  export default {
    name: 'step-list',
    props: {
      group: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        expanded: false
      }
    },
    computed: {
      planId () {
        return this.$route.query.planId
      }
    },
    created () {
      const steps = this.group.steps || []
      const route = this.$route
      if (findStep({stepRoutes: steps, route})) {
        this.expanded = true
      }
    },
    methods: {
      toggleVisible () {
        this.expanded = !this.expanded
      },
      onClickTitle () {
        const {steps, step} = this.group
        if (steps) {
          this.toggleVisible()
        } else if (step) {
          this.nav(step)
        }
      },
      // 和当前步骤相比，是否是之前的步骤
      isPrevious (step) {
        return this.$store.getters.stepInOrder(step, this.$route)
      },
      isActive (step) {
        return this.isPrevious(step) ||
          step.name === this.$route.name ||
          (step.children && step.children.find(child => child.name === this.$route.name))
      },
      nav (step) {
        if (!this.isPrevious(step)) return
        const {tipSaveBeforeLeave} = this.$route.meta || {}
        Promise.all([!tipSaveBeforeLeave, tipSaveBeforeLeave && this.tipSave()]).then(() => {
          this.$emit('nav')
          const route = this.$store.getters.stepToRoute(step)
          this.$router.push({...route, query: this.$route.query})
        }, () => {})
      },
      tipSave () {
        return new Promise((resolve, reject) => {
          this.$vux.confirm.show({
            title: '提示',
            content: '当前页面未保存，是否继续跳转流程？',
            onConfirm: resolve,
            onCancel: reject
          })
        })
      }
    }
  }
</script>
<style lang="less">
  .component-step-list {
    color: white;
    padding: 23.5px 26.5px 0 15px;

    h4 {
      font-size: 15px;
      margin-bottom: 8px;
      font-weight: normal;

      &.active {
        color: #00adff;
      }
    }

    .arrow-down {
      background: url(../../../assets/styles/images/bottom.png) no-repeat scroll center right;
      background-size: 13px 7px;
    }

    .arrow-up {
      background: url(../../../assets/styles/images/top.png) no-repeat scroll center right;
      background-size: 13px 7px;
    }


    .list {
      font-size: 13px;
      margin-top: -5px;

      a {
        display: block;
        color: #ddd;
        padding: 5px;

        &:before {
          content: '';
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background: #ddd;
          margin-right: 5px;
        }
      }

      .active {
        color: #00adff;

        &::before {
          background-color: #00adff;
        }
      }
    }
  }
</style>
