import StepTypes from 'src/data/StepTypes'
import router from './router'
import store, {ACTION} from 'src/store'

const stepBack = function () {
  const routes = store.getters.stepRoutes
  const route = router.currentRoute
  const {planId} = route.query
  const stepId = store.getters.getStepId(route)
  if (!stepId) {
    throw new Error(`未能找到路由"${JSON.stringify(router.currentRoute)}"关联的步骤信息，请为该路由关联步骤信息`)
  }
  store.dispatch(ACTION.GET_STEP_PREV, {stepId, planId}).then(stepId => {
    if (stepId === StepTypes.NativeView) {
      typeof window.closeWebview === 'function' && window.closeWebview()
      console.log('请求window.closeWebview方法关闭窗口')
    } else {
      const prevStep = routes.find(route => route.id === stepId)
      const prevRoute = store.getters.stepToRoute(prevStep)
      window.toggleMenu(2, false) // 返回时清除右边按钮一定是没问题的
      router.replace({...prevRoute, query: route.query})
    }
  }).catch(console.error)
}
export default stepBack
