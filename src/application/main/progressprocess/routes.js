// - adduser: 投保进度
export default [{
  path: '/progressprocess',
  name: 'progressprocess',
  components: {
    default: resolve => require(['./main.vue'], resolve)
  },
  meta: {
    requireAuth: true,
    title: '投保进度',
    leftMenu: {
      title: '返回',
      javascript: 'closeWebview'
    },
    rightMenu: {
      title: '搜索',
      javascript: 'gotosearchprogproc'
    }
  },
  Info: {
    description: '投保进度',
    param: {}
  }
},
  {
    path: '/searchprogproc',
    name: 'searchprogproc',
    components: {
      default: resolve => require(['./searchprogproc.vue'], resolve)
    },
    meta: {
      requireAuth: true,
      title: '投保单查询',
      rightMenu: null
    },
    Info: {
      description: '投保单查询',
      param: {}
    }
  },
  {
    path: '/progressinfo',
    name: 'progressinfo',
    components: {
      default: resolve => require(['./progressinfo.vue'], resolve)
    },
    meta: {
      requireAuth: true,
      title: '投保单详情',
      rightMenu: null
    },
    Info: {
      description: '投保单详情',
      param: {}
    }
  }
]
