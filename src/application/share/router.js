import Vue from 'vue'
import Router from 'vue-router'
import {aliveView} from 'src/components/inlineView'
import setTitle from 'src/utils/setTitle'
import taxRoute from 'src/application/main/taxDweller/route'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/share',
  routes: [ 
    {
      path: '/sign',
      component: aliveView,
      children: [
        {
          path: '',
          component: () => import('./sign'),
          meta: {
            title: '电子签名'
          }
        }
      ]
    },
    {
      path: '/taxDweller',
      component: () => import('../main/taxDweller'),
      meta: {
        title: '税收居民'
      }
    },
    {
      name: 'plan-preview',
      path: '/plan/preview',
      component: () => import('./plan-preview'),
      meta: {
        title: '预览投保书'
      }
    },
    taxRoute,
    {
      name: 'result',
      path: '/result',
      component: () => import('./result')
    }  
  ]
})

router.afterEach(to => {
  const {meta} = to
  const {title} = meta || {}
  if (title) setTitle(title)
})

export default router
