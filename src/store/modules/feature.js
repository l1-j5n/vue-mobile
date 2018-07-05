import {SET_ENV} from 'src/store/mutation-types'
import Env from 'src/data/Env'

// 当前只有一个feature： 代码是否跑在app内
export default {
  state: {
    env: void 0
  },
  getters: {
    inApp (state) {
      return Env.App === state.env
    },
    h5 (state) {
      return process.env.NODE_ENV !== 'production' || Env.App !== state.env
    }
  },
  mutations: {
    [SET_ENV] (state, env) {
      state.env = env
    }
  }
}
