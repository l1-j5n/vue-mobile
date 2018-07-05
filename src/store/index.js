import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import * as actions from './action-types'
import ui from './modules/ui'
import plan from './modules/plan'
import step from './modules/step'
import feature from './modules/feature'
import banks from './data/banks'
import cache from './modules/cache'

Vue.use(Vuex)

const store = new Vuex.Store({
  // actions,
  // getters,
  state: {
    publicDictionary: ''
  },
  modules: {
    ui,
    plan,
    step,
    feature,
    cache,

    banks
  },
  actions: {
    // getStore ({ commit, state }, bool) {
    //   commit(types.LOADIND_STORE)
    // },
    // setStore ({ commit, state }) {
    //   commit(types.SET_STORE)
    // },
    // dictionarStore ({ commit }, callback) {
    // }
  },
  mutations: {
    // [types.LOADIND_STORE] (state) {
    // },
    // [types.SET_STORE] (state) {
    // },
    // setDictionary (state, value) {
    // }
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: []
})

export default store
export const MUTATION = types
export const ACTION = actions
