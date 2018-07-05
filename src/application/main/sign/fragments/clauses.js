import {mapGetters} from 'vuex'
export default {
  name: 'sign-clauses',
  props: {
    clauses: Array
  },
  render (h) {
    const {clauses} = this.$props
    if (!clauses) return null
    const links = clauses.reduce((pub, clause, index) => {
      if (index > 0) {
        pub.push('、')
      }
      const link = h('a', {
        attrs: {
          href: clause.url
        },
        on: {
          click: event => this.viewDetail(clause, event)
        }
      },'《' + clause.name + '》')
      pub.push(link)
      return pub
    }, [])
    return h('span', ['本人已同意', ...links, '。'])
  },
  computed: {
    ...mapGetters(['inApp'])
  },
  methods: {
    viewDetail (clause, event) {
      if (this.inApp) {
        event.preventDefault()
        window.articleDetail(clause.url)
      }
    }
  }
}
