<!--
  保险产品详细模块
  -- jankergg
-->
<template>
  <div class="container choose-plan">
    <template v-if="prolist.length">
      <check-list labelPosition="right" required :options="prolist" v-model="checkList"></check-list>
      <div class="page__ft">
        <div @click="nextStep" class="btn-next"> 确定</div>
      </div>
    </template>
    <template v-else>
      <div class="no-ins">暂无可添加的险种</div>
    </template>
  </div>
</template>

<script>
import { checkList } from 'vformer'
import store, {ACTION} from 'src/store'
import {toast} from 'src'
import { MAININSLIST, LOADRIDERINSLIST, SETPRODUCTLIST, SETRIDERINSLIST } from '@/api'
export default {
  name: 'choose-plan',
  data() {
    return {
      checkList: [],
      prolist: [],
      type: this.$route.query.type
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      // 判断是获取主险还是附加险
      let getInsList = MAININSLIST
      let params = {}
      if (this.type === 'rider') {
        getInsList = LOADRIDERINSLIST
        const { insureId, planId, parentId } = this.$route.query
        params = { insureId, planId, productId: parentId }
      }
      this.axios.post(getInsList, params).then(({ data }) => {
        if (data.success) {
          const list = this.type === 'rider' ? data.value.riderList : data.value
          const { selectedIds, whiteList } = this.$route.query
          let prolist = list.map(item => {
            return {
              key: item.subCode,
              value: item.subName,
              link: '/appfeature?productId='+item.subCode,
              ...item
            }
          })
          // 如果存在白名单，则先过滤出白名单（团险）
          // 规则： 第一被保人选择了团险，则其它被保人只能选团险
          if (whiteList){
            let ids = whiteList.split(';')
            let maped = []
            ids.map(id => {
              const item = prolist.find(p => p.key === id)
              maped.push(item)
            })
            prolist = maped
          } else if (selectedIds){
            // 如果存在已选的
            let ids = selectedIds.split(';')
            ids.map(id => {
              const item = prolist.find(p => p.key === id)
              prolist.splice(prolist.indexOf(item), 1)
            })
          }
          this.prolist = prolist
        } else {
          this.__toast(data.errorMsg)
        }
      })
    },
    setProductList() {
      const { insureId, planId, parentId } = this.$route.query
      const productIds = this.checkList
      // 默认是添加主险的接口
      let postApi = SETPRODUCTLIST
      let params = { insureId, productIds, planId }

      if (parentId && this.type === 'rider') {
        params.parentId = parentId
        // 添加附加险的接口
        postApi = SETRIDERINSLIST
      }
      return this.axios.post(postApi, params)
    },
    nextStep() {
      this.setProductList().then(({ data }) => {
        if (data.success) {
          this.updateSteps()
          let mainQuery = { ...this.$route.query }
          // 删除险种类型，这个不需要回传
          delete mainQuery.type
          delete mainQuery.parentId
          delete mainQuery.selectedIds
          // TODO  如果添加的是团险，则带地址上带信号，只过滤出团险
          // TODO 暂写上2个固定的，等接口给出识别码再改掉
          let groupIns = ['FXL000006','FXL000007']
          let selectedId = this.checkList[0]
          let whiteList = ''
          if (groupIns.indexOf(selectedId)>-1){
            whiteList = selectedId
            mainQuery.whiteList = whiteList
          }
          this.$router.replace({ name: 'make-plan', query: mainQuery })
        } else {
          this.__toast(data.errorMsg)
        }
      })
    },
    // 当产品更新了，需要更新步骤信息
    updateSteps () {
      const {planId} = this.$route.query
      store.dispatch(ACTION.GET_REMOTE_STEPS, {planId}).then(null, toast)
    }
  },
  components: {
    checkList
  }
}
</script>
<style lang='less'>
@import '../../../../assets/styles/page.less';
@import "../../../../assets/styles/weui/widget/weui-button/weui-button";
@import "../../../../assets/styles/weui/widget/weui_cell/weui_check";
.choose-plan {
  .page__ft {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .no-ins {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
