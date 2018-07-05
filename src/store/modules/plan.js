/*
* @Author: jankergg
* @Date:   2018-05-29 16:53:58
* @Last Modified by:   jankergg
* @Last Modified time: 2018-06-08 11:30:38
TODO:

*/
// 1 客户信息
// 2 产品信息
// 3 保险计划
// 4 STEP_PREW
// 3001 分享计划书
// 3002 分享预览计划书
// 10 完善客户信息
// 11 受益人
// 12 支付信息
// 13 投保人告知
// 14 被保人告知
// 15 代理人告知
// 16 预览投保书
// 100 投保单流程已结束
const state = {
  insList: null
}

const getters = {
  getInsList (state) {
    return state.insList
  }
}

const actions = {
  setInsList ({ commit, state }, n) {
    commit('insList', n)
  }
}
const mutations = {
  insList (state, n) {
    state.insList = n
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
