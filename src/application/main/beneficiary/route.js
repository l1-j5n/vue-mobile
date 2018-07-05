/* beneficiary
*/
import StepTypes from 'src/data/StepTypes'
import {mainView} from 'src/components/inlineView'

export default {
  path: '/beneficiary',
  redirect: '/beneficiary/beneficiary-list',
  name: 'beneficiary',
  components: {
    default: mainView,
    sidebar: () => import('src/application/base/sidebar')
  },
  step: {
    id: StepTypes.JoinBeneficiaries,
    name: '选择受益人'
  },
  children: [
    {
      path: 'beneficiary-list',
      name: 'beneficiary-list',
      components: {
        default: () => import('./beneficiary-list')
      },
      meta: {
        requireAuth: true,
        title: '指定受益人',
        rightMenu: null
      }
    },
    {
      path: 'beneficiary-info',
      name: 'add-beneficiary-info',
      components: {
        default: () => import('./beneficiary-info')
      },
      meta: {
        requireAuth: true,
        tipSaveBeforeLeave: true,
        title: '受益人信息',
        rightMenu: null,
        leftMenu: {
          title: '返回',
          javascript: 'gobackbtn',
          params: 'beneficiary-list|query'
        }
      }
    }
  ],
  Info: {
    description: '受益人信息'
  },
}

