// - adduser: 录入基本信息
import {mainView} from 'src/components/inlineView'

export default {
  path: '/result',
  redirect:'/result/success',
  components: {
    default: mainView
  },
  children: [
    {
      path: 'success',
      name: 'resultsucc',
      components: {
        default: resolve => require(['./resultsucc.vue'], resolve)
      },
      meta: {
        requireAuth: true,
        title: '投保成功',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn'
        }
      }
    },{
      path: 'fail',
      name: 'resultfail',
      components: {
        default: resolve => require(['./resultfail.vue'], resolve)
      },
      meta: {
        requireAuth: true,
        title: '投保失败',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn'
        }
      }
    },{
      path: 'manual',
      name: 'resultmanual',
      components: {
        default: resolve => require(['./resultmanual.vue'], resolve)
      },
      meta: {
        requireAuth: true,
        title: '人工核保失败',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn'
        }
      }
    },{
      path: 'wait',
      name: 'resultwait',
      components: {
        default: resolve => require(['./resultwait.vue'], resolve)
      },
      meta: {
        requireAuth: true,
        title: '等待中...',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn'
        }
      }
    },{
      path: 'waitMultiple',
      name: 'resultWaitMultiple',
      components: {
        default: resolve => require(['./result-wait-multiple.vue'], resolve)
      },
      meta: {
        requireAuth: true,
        title: '错误',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn'
        }
      }
    },{
      path: 'failself',
      name: 'resultfailself',
      components: {
        default: resolve => require(['./resultfailself.vue'], resolve)
      },
      meta: {
        requireAuth: true,
        title: '自核失败',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn'
        }
      }
    }
  ],
  meta: {
    requireAuth: true,
    title: '投保结果',
    rightMenu: null,
    leftMenu: {
      title: '返回',
      javascript: 'gobackbtn'
    }
  },
  Info: {
    description: '投保结果',
    step: 1,
    param: {}
  }
}
