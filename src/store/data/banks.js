import axios from 'axios'
import {GET_BANK_LIST} from 'src/api'
import {GET_BANKS, GET_REMOTE_BANKS, RESOLVE_CARD} from '../action-types'
import {SET_BANKS} from '../mutation-types'

export default {
  state: {
    banks: null
  },
  getters: {
    banks (state) {
      return {
        default: state.banks,
        filter: ({payType}) => {
          return (state.banks || []).filter(bank => bank.payType.includes(payType))
        }
      }
    }
  },
  mutations: {
    [SET_BANKS] (state, {banks}) {
      state.banks = banks
    }
  },
  actions: {
    [GET_BANKS] ({dispatch, getters, state}, filters) {
      return (state.banks ? Promise.resolve(state.banks) : dispatch(GET_REMOTE_BANKS)).then(banks => {
        return filters ? Promise.resolve(getters.banks.filter(filters)) : getters.banks.default
      })
    },
    [GET_REMOTE_BANKS] ({commit}) {
      return axios.get(GET_BANK_LIST).then(({data: {success, value, errorMsg}}) => {
        if (success) {
          const banks = value.dictItemList.map(bank => ({
            ...bank,
            ...{
              name: bank.desc,
              value: bank.code,
              issuerId: bank.issueId,
              desc: null,
              code: null,
              issueId: null
            }
          }))
          commit(SET_BANKS, {banks})
          return Promise.resolve(banks)
        } else {
          return Promise.reject(errorMsg)
        }
      })
    },
    [RESOLVE_CARD] ({dispatch}, {card}) {
      return dispatch(GET_BANKS).then(banks => {
        const {issuer, type, issuer_id} = card
        const bank = banks.find(bank => bank.issuerId === issuer_id)
        return bank ? Promise.resolve(bank) : Promise.reject(`暂不支持${issuer}${type}`)
      })
    }

  }
}
