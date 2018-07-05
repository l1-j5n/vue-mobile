<!--
  保险产品详细模块
  -- jankergg
  说明：初始化拉取数据方法：loadProduct()
  添加主险：添加完之后调用 loadProduct()，用以获取完整数据
  删除险种：删除完之后调用 loadProduct重新初始化
-->
<template>
  <div class="container make-plan">
    <header>
      <tabs
       :insurantList="insList"
       :selected="insIndex"
       :disabled="disableSwitchInsurant"
       msg="请先给第一被保人添加主险"
       label="name"
       @onSelect="onChangeInsurant">
      </tabs>
    </header>
    <div class="page__hd" v-if="isEmpty">
      <p class="page__desc">保险计划</p>
      <div class="btn_box">
        <button class="weui-btn weui-btn_plain-primary" @click="addInsProduct">添加主险</button>
      </div>
    </div>
    <div class="page__bd" v-else>
      <div class="plan-detail">
        <div class="space-between">
          <div class="left">保险计划</div>
          <div class="right" @click="addInsProduct" v-if="shouldAddMoreProduct">添加主险</div>
        </div>
        <!-- 遍历循环渲染产品列表 -->
        <div class="product-item-box" v-for="(product, index) in productList" :key="index">
          <product-item :name="product.productId" :product="product" :insureMoney="insureMoney"
          @onSyncData="syncDataFromInside"
          @onAddRider="addInsProduct"
          @onRemove="removeProduct"
          @onInit="onProductInit">
          </product-item>
        </div>
      </div>
    </div>
    <div class="page__ft">
      <div class="totalprice">
        首年保费合计: &nbsp; <span class="Premium">{{totalmoney}}元</span>
      </div>
      <div class="btn-next" @click="nextStep">生成计划书</div>
    </div>
  </div>
</template>

<script>
import productItem from '@/components/product-item'
import { tabs } from '@/components/index'
import { LOADALLINSURANT, LOADPROLIST, RMVPRODUCT, CHECKRULE, QUERYPROGRESS, SETPRODUCTLIST } from '@/api'
import {mapActions} from 'vuex'
import store, {ACTION} from 'src/store'

export default {
  name: 'make-plan',
  data() {
    return {
      //被保人列表
      insList: [],
      // 默认被保人
      insIndex: 0,
      // 产品列表，由接口获取
      productList: [],
      // 当前被保人保费合计
      insureMoney: '',
      // 总金额，由接口获取
      totalmoney: '',
      // 表单集合
      formCollection: {},
      // 产品是否为空，用来展示默认界面
      isEmpty: true,
      disableSwitchInsurant: false, // 是否可以切换被保人
      shouldAddMoreProduct: false // TODO 根据当前产品判断是否可以添加更多主险
    }
  },
  created() {
    //主FXL000001，附FXL000003
    window.makeplan = this
    // const { planId } = this.$route.query
    // NOTE: 此处缓存策略无法更新同planId的保单，弃用
    // let insList = this.$store.getters.getInsList
    // 先读取store, 以planId为索引
    // if (!insList || !insList[planId]) {
    //   this.loadAllInsurant()
    // } else {
    //   this.insList = insList[planId]
    //   this.setProductList()
    // }
    this.loadAllInsurant()
  },
  watch: {
    insList: {
      deep: true,
      handler(v) {
        // 如果有被保人ID，则拉取保单详情
        let {insureId} = this.$route.query
        if (insureId) {
          if (v && v.length) {
            let ins = v.find(i => i.insureId === insureId)
            // 更新 tab 显示
            this.insIndex = v.indexOf(ins)
          }
          this.loadProduct()
        } else {
          // 否则默认切换到第一被保人
          this.onChangeInsurant(0)
        }
      }
    },
    productList: {
      deep: true,
      handler(v){
        const { insureId } = this.$route.query
        const ins = this.insList.find(i => i.insureId === insureId)
        const insIndex = this.insList.indexOf(ins)
        this.isEmpty = !v.length
        // 当前是第一被保人的时候，必须先添加主险再让切换
        this.disableSwitchInsurant = !v.length && insIndex === 0
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    const {planId, planType} = from.query
    store.dispatch(ACTION.GET_ROUTE_PREV, {planId, route: from}).then(prevRoute => {
      const isPrev = prevRoute && (prevRoute.name === to.name || prevRoute.path === to.path)
      if (planType === 'sharePlan' && isPrev) {
        next(false)
        this.$router.push({name: 'add-user', query: from.query})
      } else {
        next()
      }
    })
  },
  methods: {
    // ==================================================初始化操作=====================================================================
    //初始化formUnit组件
    onProductInit(v) {
      // v: {name:{}}
      // 将当前表单挂载到当前结点
      Object.assign(this.formCollection, v)
    },
    //加载所有被保人
    loadAllInsurant() {
      const { planId } = this.$route.query
      return this.axios.post(LOADALLINSURANT, { planId }).then(({ data }) => {
        if (data.success) {
          let plans = data.value.content.planList
          this.insList = plans ? plans[0].insurants : []
          // 存储insList, 并以planId为key
          // let storeObj = {}
          // storeObj[planId] = [...this.insList]
          // this.$store.dispatch('setInsList', storeObj)

          // setProduct if productId exists
          this.$nextTick(() => {
            this.setProductList().then(res => {
              if (res){
                let query = {...this.$route.query}
                delete query.productId
                this.$router.replace({ name: 'make-plan', query: query })
                this.loadProduct()
              }
            })
          })
        } else {
          this.__toast(data.errorMsg)
        }
      })
    },
    // 初始化时拉取数据
    loadProduct() {
      const { insureId, planId } = this.$route.query
      this.axios.post(LOADPROLIST, { insureId, planId }).then(({ data }) => {
        if (data.success) {
          this.setInitData(data)
        } else {
          this.__toast(data.errorMsg)
        }
      })
    },
    // 如果是从产品列表过来的，把带过来的product 给第一被保人
    setProductList() {
      const { insureId, planId, productId } = this.$route.query
      const productIds = [productId]
      // 默认是添加主险的接口
      let params = { insureId, productIds, planId }
      if (!productId){
        return Promise.resolve(false)
      }
      return this.axios.post(SETPRODUCTLIST, params)
    },
    // ==================================================数据处理=====================================================================
    //初始化数据
    setInitData(data) {
      const res = data.value.content
      // 如果规则有错，就触发提示
      const ruleList = res.ruleList || []
      if (ruleList.length){
        this.__toast(ruleList[0])
      }
      const ins = res.insurants[0]
      this.insureMoney = ins.totalPremium
      this.totalmoney = res.totalPremium
      this.productList =  ins ? ins.productList : []
    },
    //切换被保险人
    onChangeInsurant(index) {
      let query = { ...this.$route.query }
      if (query.insureId !== this.insList[index].insureId) {
        query.insureId = this.insList ? this.insList[index].insureId : ''
        this.$router.replace({ name: 'make-plan', query: query })
        this.loadProduct()
      }
    },
    syncDataFromInside(data) {
      // 因为接口变化这里的逻辑弃用。改为重新拉取数据
      // 同步一下总金额
      // this.totalmoney = data.value.content.totalPremium
      this.loadProduct()
    },
    // ==================================================增删保险操作=====================================================================
    // 添加险种
    addInsProduct(e, parentId, selectedRiderProducts) {
      // 如果是添加附加险，会多传过来一个parentId
      let query = { ...this.$route.query, type: 'main' }
      // 取得已选中的险种
      let mainProducts = this.productList.map(prod => prod.productId)// 主险
      let riderProducts = selectedRiderProducts || [] // 附加险

      // 此时e == ‘rider’
      if (typeof e === 'string') {
        query.type = e
        query.parentId = parentId,
        query.selectedIds = riderProducts.join(';')
      } else {
        query.selectedIds = mainProducts.join(';')
      }
      this.$router.push({ name: 'choose-plan', query: query })
    },
    // 删除险种
    removeProduct(e, product) {
      const { commodityId } = product
      const { planId, insureId, whiteList } = this.$route.query
      let params = { insureId, commodityId, planId }
      // 如果是附加险则带上parentId
      if (product.parentId) {
        params.parentId = product.parentId
      }
      return this.axios.post(RMVPRODUCT, params).then(({ data }) => {
        if (data.success) {
          // 如果有白名单，删除主险的时候一块干掉
          if (whiteList){
            let query = {...this.$route.query}
            delete query.whiteList
            this.$router.replace({ name: 'make-plan', query: query })
          }
          // 重新拉取数据
          return this.loadProduct()
        } else {
          this.__toast(data.errorMsg)
        }
      })
    },
    // ==================================================验证类=====================================================================
    // 验证全部
    validateAll() {
      // get form
      const forms = Object.keys(this.formCollection)
      // get form promised
      const formPromise = forms.map(form => this.formCollection[form].validateAll())
      return Promise.all(formPromise).then(res => {
        let unsolved = res.find(i => i !== true)
        if (unsolved === undefined) {
          return true
        } else {
          return unsolved
        }
      }).catch(e => { console.log(e) })
    },
    getProgress(){
      const { planId } = this.$route.query
      return this.axios.post(QUERYPROGRESS, { planId }).then(({ data })=>{
        console.log('progress', data)
      })
    },
    nextStep() {
      // 验证全部表单项
      this.validateAll().then(res => {
        if (res === true) {
          const route = this.$route
          const {planId} = route.query
          this.axios.post(CHECKRULE, { planId, planTypeFlag: "sharePlan" }).then(({ data }) => {
            if (data.success) {
              const ruleList = data.value.content.productList || []
              // 如果接口有报错就显示报错并且阻断流程, 这里不是重复
              if (ruleList.length){
                return this.__toast(ruleList[0])
              }
              // 动态的下一步
              store.dispatch(ACTION.GET_ROUTE_NEXT, {planId, route}).then(nextRoute => {
                this.$router.push({...nextRoute, query: route.query})
              })
            } else {
              if (data.errorMsg) {
                this.$vux.toast.show({ text: data.errorMsg })
              }
            }
          })
        } else {
          let errorMsg = res.getErrorMsg()
          this.$vux.toast.show({ text: errorMsg })
        }
      })
    }
  },
  components: {
    productItem,
    tabs
  }
}
</script>
<style lang='less' scoped>
  @import '../../../../assets/styles/page.less';
  .container {
    padding-bottom: 50px;
    background: @titleBg;
  }
  .make-plan{
    header {
      padding: 10px 0;
      background: @weuiBgColorPlain;
    }
    .page__hd{
      padding:10px;
    }
    .page__bd {
      padding: 0 10px;
    }
    .page__desc{
      padding:10px 0;
      color: @titleColor;
    }
    .right {
      color: @btnBlue;
      padding: 2px 4px;
      border: 1px solid @btnBlue;
    }
    .page__ft,.weui-cell__ft{
      display: flex;
      overflow: hidden;
      position: fixed;
      height: 50px;
      left: 0;
      bottom: 0;
      right:0;
      text-align: center;
      line-height: 50px;
      background: @weuiBgColorPlain;
      .totalprice {
        flex: 6;
        font-size: 16px;
        box-sizing: border-box;
        .price{
          color: @weuiColorPrimary;
          font-weight: bold;
        }
        .Premium {
          color: @colorPremium;
        }
      }
      .btn-next{
        flex: 4;
        height: 50px;
        position: relative;
        font-size: 17px;
        line-height: 50px;
      }
    }
  }
</style>
