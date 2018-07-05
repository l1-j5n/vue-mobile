/* - viewplan: 预览计划书
* @Author: jankergg
* @Date:   2018-05-10 10:15:40
* @Last Modified by:   jankergg
* @Last Modified time: 2018-07-03 12:26:15
*/
import StepTypes from 'src/data/StepTypes'
import {mainView} from 'src/components/inlineView'

export default {
  path: '/viewplan',
  Info: {
    description: '预览计划书'
  },
  components: {
    default: mainView,
    sidebar: () => import('src/application/base/sidebar')
  },
  children: [
    {
      path: '',
      name: 'view-plan',
      components: {
        default: () => import('./view-plan')
      },
      step: {
        id: StepTypes.PreviewAssurances,
        name: '预览建议书'
      },
      meta: {
        requireAuth: true,
        title: '预览计划书',
        rightMenu: null
      }
    }
  ]
}
