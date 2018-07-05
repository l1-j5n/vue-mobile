/* - viewplan: 预览计划书
* @Author: jankergg
* @Date:   2018-05-10 10:15:40
* @Last Modified by:   jankergg
* @Last Modified time: 2018-05-26 12:03:39
*/
import StepTypes from '../../../data/StepTypes'
import {mainView} from 'src/components/inlineView'

export default {
  path: '/viewinsurerpact',
  Info: {
    description: '预览投保书'
  },
  components: {
    default: mainView,
    sidebar: () => import('src/application/base/sidebar')
  },
  children: [
    {
      path: '',
      name: 'view-insurerpact',
      components: {
        default: () => import('./view-insurerPact')
      },
      step: {
        id: StepTypes.PreviewApplication,
        name: '预览投保书'
      },
      meta: {
        requireAuth: true,
        title: '预览投保书',
        rightMenu: null
      }
    }
  ]
}
