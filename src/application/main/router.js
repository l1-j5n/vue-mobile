/*
* @Author: jankergg
* @Date:   2018-05-08 11:13:40
* @Last Modified by:   jankergg
* @Last Modified time: 2018-06-25 15:35:08
说明： 控制step流程的逻辑写在store/modules/plan.js
* TODO: 1、重复模块合并, addUser/insure
* TODO: 2、页面导航，前进后退，指定跳转
* TODO: 3、侧边栏导航
* TODO: 4、nextStep guarding
*/

import Vue from 'vue'
import Router from 'vue-router'
// 页面模块 start
// import 时建议写相对路径
import gallery from '../base/gallery'
import appFeature from '../base/appfeature'
import demo from '../../../demo'
import addinfo from './addinfo/route'
import {adduser, insure} from './adduser/route'
import makePlan from './makeplan/route'
import notify from './notify/route'
import viewplan from './viewplan/route'
import viewinsurerpact from './viewInsurerPact/route'
import progressprocess from './progressprocess/routes'
import ordersearch from './orderlist/routes'
import beneficiary from "./beneficiary/route"
import namecard from '../base/user'
import sign from './sign/route'
import taxDweller from './taxDweller/route'
import result from './result/route'
// 页面模块 end

import {pluckRoutes} from 'src/service/stepService'
import store, {MUTATION} from 'src/store'

Vue.use(Router)

// 所有页面
export const routes = [
  appFeature,
  addinfo,
  adduser,
  insure,
  makePlan,
  gallery,
  notify,
  demo,
  viewplan,
  viewinsurerpact,
  ...progressprocess,
  beneficiary,
  ...ordersearch,
  namecard,
  sign,
  taxDweller,
  result
]

const router = new Router({
  mode: 'history',
  linkExactActiveClass: '',
  linkActiveClass: 'active',
  routes
})

router.onReady(() => {
  store.commit(MUTATION.SET_STEP_ROUTES, {stepRoutes: pluckRoutes(routes)})
})

export default router

