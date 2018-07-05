import store from './store'
const ADD_SEARCH_LOG = 'ADD_SEARCH_LOG'
const SYNC_TO_STORAGE = 'SYNC_TO_STORAGE'

export default {
  state: {
    keywords: []
  },
  getters: {
    keywords (state) {
      return [...state.keywords].reverse().sort((a,b) => a.count > b.count).map(it => it.keyword)
    }
  },
  mutations: {
    [ADD_SEARCH_LOG] (state, {keyword}) {
      const {keywords} = state
      const index = keywords.findIndex(it => it.keyword === keyword)
      if (index > -1) {
        keywords[index].count += 1
      } else {
        keywords.push({keyword, count: 1})
      }
      state.keywords = keywords
    },
    [SYNC_TO_STORAGE] (state, {keyword}) {
      const keywords = store.getItem('queryKeywords') || []
      const index = keywords.findIndex(it => it.keyword === keyword)
      if (index > -1) {
        keywords[index].count += 1
      } else {
        keywords.push({keyword, count: 1})
      }
      store.setItem('queryKeywords', keywords)
    }
  },
  actions: {
    //
  }
}
