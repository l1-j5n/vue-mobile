export default [
  { // 保单列表
    path: '/orderlist',
    name: 'orderlist',
    components: {
      default: resolve => require(['./main.vue'], resolve)
    },
    meta: {
      requireAuth: true,
      rightMenu: {
        title: '搜索',
        javascript: 'gotoqueryorder'
      },
      leftMenu: {
        title: '返回',
        javascript: 'closeWebview'
      },
      title: '保单',
      exclude: {
        default: 'progressSearch'
      }
    },
    Info: {
      descript: '保单查询列表',
      param: {}
    }
  }, { // 保单详情
    path: '/orderdetail',
    name: 'orderdetail',
    components: {
      default: resolve => require(['./orderdetail.vue'], resolve)
    },
    meta: {
      requireAuth: true,
      rightMenu: null,
      leftMenu: {
        title: '返回',
        javascript: 'gobackbtn',
        params: 'orderlist|query'
      },
      title: '保单详情',
      exclude: {
        default: 'searchdetail'
      }
    },
    Info: {
      descript: '保单详情',
      param: {}
    }
  },{ // 搜索查询
    path: '/queryorder',
    name: 'queryorder',
    components: {
      default: resolve => require(['./queryorder.vue'], resolve)
    },
    meta: {
      requireAuth: true,
      rightMenu: null,
      leftMenu: {
        title: '返回',
        javascript: 'gobackbtn',
        params: 'orderlist|query'
      },
      title: '查询保单',
      exclude: {
        default: 'search'
      }
    },
    Info: {
      descript: '查询投保单',
      param: {}
    }
  },
]
