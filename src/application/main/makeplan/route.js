/* - makeplan: 制定保险计划
* @Author: jankergg
* @Date:   2018-05-10 10:15:40
* @Last Modified by:   jankergg
* @Last Modified time: 2018-07-03 12:26:32
*/
import {mainView, asideView} from 'src/components/inlineView'
import StepTypes from 'src/data/StepTypes'

const sidebarView = {
  template: '<router-view name="sidebar"/>',
  name: 'Sidebar'
}
export default {
  path: '/plan',
  redirect: '/plan/make',
  components: {
    default: mainView,
    sidebar: asideView
  },
  Info: {
    description: '制定投保计划'
  },
  children: [
    {
      path: 'make',
      name: 'make-plan',
      components: {
        default: () => import('./make-plan'),
        sidebar: () => import('src/application/base/sidebar')
      },
      step: {
        id: StepTypes.JoinProduct,
        name: '制定保险计划'
      },
      meta: {
        title: '制定投保计划'
      }
    },
    {
      path: 'choose',
      name: 'choose-plan',
      components: {
        default: resolve => require(['./choose-plan'], resolve)
      },
      meta: {
        requireAuth: true,
        title: '投保计划',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn',
          params: 'make-plan|query'
        }
      }
    }
  ]
}
