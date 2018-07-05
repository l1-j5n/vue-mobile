/* - notify: 健康告知
* @Author: simon
* @Date:   2018-05-21 10:15:40
* @Last Modified by:   jankergg
* @Last Modified time: 2018-06-13 11:59:03
*/
import StepTypes from 'src/data/StepTypes'
import {mainView, asideView} from 'src/components/inlineView'


// const staticView = {
//   template: '<router-view/>',
//   name: 'Notify'
// }
//
// const sidebarView = {
//   template: '<router-view name="sidebar"/>',
//   name: 'Sidebar'
// }

export default {
  path: '/notify',
  redirect: '/notify/applicant',
  name: 'notify',
  components: {
    default: mainView,
    sidebar: asideView
  },
  children: [
    {
      path: 'applicant',
      name: 'notify-applicant',
      components: {
        default: () => import('./page/app-impart'),
        sidebar: () => import('src/application/base/sidebar')
      },
      step: {
        id: StepTypes.ApplicantNotify,
        name: '投保人告知'
      },
      meta: {
        requireAuth: true,
        tipSaveBeforeLeave: true,
        title: '投保人告知',
        rightMenu: null
      }
    },
    {
      path: 'insurant',
      name: 'notify-insurant',
      components: {
        default: () => import('./page/ins-impart'),
        sidebar: () => import('src/application/base/sidebar')
      },
      step: {
        id: StepTypes.InsuredNotify,
        name: '被保人告知'
      },
      meta: {
        requireAuth: true,
        tipSaveBeforeLeave: true,
        title: '被保人告知',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn',
          params: 'notify-applicant|query'
        }
      }
    },
    {
      path: 'grade',
      name: 'notify-grade',
      components: {
        default: () => import('./page/grade-impart')
      },
      meta: {
        requireAuth: true,
        tipSaveBeforeLeave: true,
        title: '分级健告',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn',
          params: 'notify|query'
        }
      }
    },
    {
      path: 'transition',
      name: 'transition',
      components: {
        default: () => import('./page/transition')
      },
      meta: {
        requireAuth: true,
        title: 'test',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn',
          params: 'notify|query'
        }
      }
    }
  ],
  Info: {
    description: '健康告知'
  }
}

