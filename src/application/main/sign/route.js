import StepTypes from 'src/data/StepTypes'
import {aliveView, asideView} from 'src/components/inlineView'

export default {
  path: '/sign',
  components: {
    default: aliveView,
    sidebar: asideView
  },
  children: [
    {
      path: '',
      components: {
        default: () => import('./index'),
        sidebar: () => import('src/application/base/sidebar')
      },
      step: {
        id: StepTypes.ESign,
        name: '电子签名'
      },
      meta: {
        requireAuth: true,
        title: '电子签名',
        tipSaveBeforeLeave: true,
      }
    }
  ],
  Info: {
    description: '电子签名'
  }
}
