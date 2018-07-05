import StepTypes from 'src/data/StepTypes'

// 计划书入口
// - /adduser: 录入基本信息
export const adduser = {
  path: '/adduser',
  name: 'add-user',
  components: {
    default: () => import('./plan')
  },
  meta: {
    requireAuth: true,
    title: '录入基本信息',
    leftMenu: {
      title: '返回',
      javascript: 'closeWebview'
    }
  },
  Info: {
    description: '录入基本信息'
  }
}

// e 投保入口
// - /insure: 录入基本信息
export const insure = {
  path: '/insure',
  alias: '/insure/adduser',
  name: 'insure-add-user',
  components: {
    default: () => import('./e-insure'),
    sidebar: () => import('src/application/base/sidebar')
  },
  step: {
    id: StepTypes.CustomerBasic,
    name: '录入基本信息'
  },
  meta: {
    requireAuth: true,
    tipSaveBeforeLeave: true,
    title: '录入基本信息',
    leftMenu: {
      title: '返回',
      javascript: 'closeWebview'
    }
  },
  Info: {
    description: '录入基本信息'
  }
}
