/* - addinfo: 完善信息
* @Author: jankergg
* @Date:   2018-05-10 10:15:40
* @Last Modified by:   jankergg
* @Last Modified time: 2018-06-13 11:55:21
*/
import StepTypes from 'src/data/StepTypes'
import {mainView} from 'src/components/inlineView'

export default {
  path: '/addinfo',
  redirect: '/addinfo/applicant',
  name: 'info-customer-detail',
  step: {
    id: StepTypes.CompleteCustomer,
    name: '完善客户信息'
  },
  components: {
    default: mainView,
    sidebar: () => import('src/application/base/sidebar')
  },
  children: [
    {
      path: 'applicant',
      name: 'add-applicant-info',
      components: {
        default: () => import('./applicant-info')
      },
      meta: {
        requireAuth: true,
        tipSaveBeforeLeave: true,
        title: '完善客户信息'
      }
    },
    {
      path: 'insurant',
      name: 'add-insurant-info',
      components: {
        default: () => import('./recognizee-info')
      },
      meta: {
        requireAuth: true,
        tipSaveBeforeLeave: true,
        title: '完善客户信息',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn',
          params: 'add-applicant-info|query'
        }
      }
    }
  ],
  Info: {
    description: '完善客户信息'
  }
}

// export default {
//   path: '/addinfo/applicant',
//   name: 'add-applicant-info',
//   components: {
//     default: () => import('./applicant-info/copy')
//   },
//   step: {
//     id: StepTypes.CompleteCustomer,
//     name: '完善客户信息'
//   },
//   Info: {
//     description: '完善客户信息'
//   }
// }
