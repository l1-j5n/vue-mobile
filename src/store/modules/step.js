import StepTypes from 'src/data/StepTypes'
import stepBelongs from 'src/data/stepBelongs'
import {getSteps, groupRoutes, findStep, findStepIndex} from 'src/service/stepService'
import {SET_STEPS, SET_STEP_ROUTES} from '../mutation-types'
import {GET_STEP_PREV, IN_CERTAIN_STEPS, GET_WHOLE_STEPS, GET_ROUTE_PREV,
  GET_STEPS, GET_STEP_NEXT, GET_CERTAIN_NEXT, GET_ROUTE_NEXT,
  GET_LOCAL_STEPS, GET_REMOTE_STEPS, MAINTAIN_STEPS} from '../action-types'
import { debug } from 'util';
import store from '../index'

export default {
  state: {
    // 步骤相关的路由
    stepRoutes: [],
    // 确定的路由列表头部
    certainSteps: [
      StepTypes.CustomerBasic,
      StepTypes.JoinProduct,
      StepTypes.PreviewAssurances
    ],
    // 各个计划书的步骤列表集合，key是planId, value是对应的steps
    stepsCollection: {}
  },
  getters: {
    stepRoutes (state) {
      return state.stepRoutes
    },
    // 获取步骤分组(根据src/data目录下面的stepBelongs.js文件分组)
    // 返回一个函数，该函数接收一个planId，返回该planId对应的步骤分组
    getStepGroups (state) {
      return planId => {
        const steps = state.stepsCollection[planId] || state.certainSteps
        const groups = groupRoutes({
          routes: state.stepRoutes,
          groups: stepBelongs
        })
        return groups.reduce((pub, group) => {
          const stepAvailable = group.step ? steps.includes(group.step.id) : false
          const stepsAvailable = group.steps ? group.steps.some(step => {
            return steps.includes(step.id)
          }) : false
          if (group.steps) {
            group.steps = group.steps.filter (step => {
              return steps.includes(step.id)
            })
          }
          if (stepAvailable || stepsAvailable) {
            pub.push(group)
          }
          return pub
        }, [])
      }
    },
    getStepId (state) {
      return route => {
        const {stepRoutes} = state
        const step = findStep({stepRoutes, route})
        console.assert(step && step.id, `找不到 "${JSON.stringify({name: route.name, path: route.path})}" 的步骤ID`)
        return step.id
      }
    },
    stepToRoute (state) {
      return ({name, path}) => name ? {name} : {path}
    },
    // 返回一个函数，该函数接受一个数组，数组里每一项为一个route (step), 如果route的前后顺序和步骤的前后顺序一致的话，返回true
    stepInOrder (state) {
      return (route1, route2) => {
        const {stepRoutes} = state
        const stepIndex1 = findStepIndex({stepRoutes, route: route1})
        const stepIndex2 = findStepIndex({stepRoutes, route: route2})
        return stepIndex1 < stepIndex2
      }
    }
  },
  mutations: {
    // 设置某个planId的步骤列表
    [SET_STEPS] (state, {steps, planId}) {
      state.stepsCollection[planId] = [...steps]
    },
    // 设置步骤相关的路由列表
    [SET_STEP_ROUTES] (state, {stepRoutes}) {
      state.stepRoutes = stepRoutes
    }
  },
  actions: {
    // 获取上一步
    [GET_STEP_PREV] ({dispatch, getters}, {stepId, planId}) {
      return dispatch(GET_STEPS, {stepId, planId}).then(steps => {
        const index = steps.indexOf(stepId)
        return index > 0 ? steps[index - 1] : StepTypes.NativeView
      })
    },
    // 获取下一步
    [GET_STEP_NEXT] ({dispatch, getters, state}, {stepId, planId}) {
      return dispatch(GET_CERTAIN_NEXT, {stepId}).then(null, () => dispatch(GET_STEPS, {planId}).then(steps => {
        const index = steps.indexOf(stepId)
        return steps[index + 1]
      }))
    },
    // 获取下一个路由名
    [GET_ROUTE_NEXT] ({dispatch, getters}, {planId, route}) {
      const stepId = getters.getStepId(route)
      return dispatch(GET_STEP_NEXT, {planId, stepId}).then(id => {
        const step = getters.stepRoutes.find(step => step.id === id)
        return getters.stepToRoute(step)
      })
    },
    [GET_ROUTE_PREV] ({dispatch, getters}, {planId, route}) {
      const stepId = getters.getStepId(route)
      return dispatch(GET_STEP_PREV, {planId, stepId}).then(stepId => {
        const prevStep = getters.stepRoutes.find(r => r.id === stepId)
        return getters.stepToRoute(prevStep)
      })
    },
    [GET_CERTAIN_NEXT] ({state}, {stepId}) {
      const {certainSteps} = state
      const index = certainSteps.indexOf(stepId)
      return (index >= 0 && index < certainSteps.length - 1) ?
        Promise.resolve(certainSteps[index + 1]) :
        Promise.reject(false)
    },
    // 获取步骤列表(可能是部分，也可能是整个)，但是返回的步骤列表包含当前步骤和上一步
    [GET_STEPS] ({dispatch}, {planId, stepId}) {
      return dispatch(IN_CERTAIN_STEPS, {stepId}).then(null, () => dispatch(GET_WHOLE_STEPS, {planId}))
    },
    // 获取步骤列表的头(所有步骤列表的开始几步都是一样的)
    [IN_CERTAIN_STEPS] ({state}, {stepId}) {
      return new Promise((resolve, reject) => {
        const {certainSteps} = state
        certainSteps.includes(stepId) ? resolve(certainSteps) : reject()
      })
    },
    // 获取整个步骤列表
    [GET_WHOLE_STEPS] ({dispatch}, {planId}) {
      // 本地找不着后，就去远程服务器中找
      return dispatch(GET_LOCAL_STEPS, {planId}).then(steps => steps || dispatch(GET_REMOTE_STEPS, {planId}))
    },
    // 从远程服务器拉取步骤列表
    [GET_REMOTE_STEPS] ({commit}, {planId}) {
      return getSteps({planId}).then(steps => {
        console.assert(planId, 'planId 不能为空')
        console.assert(steps, '步骤列表不能为空')
        commit(SET_STEPS, {steps, planId})
        return steps
      })
    },
    // 获取本地缓存的步骤列表
    [GET_LOCAL_STEPS] ({state}, {planId}) {
      return state.stepsCollection[planId]
    },
    // 维护路由，当有必要时请求数据更新它
    [MAINTAIN_STEPS] ({state, dispatch}, {planId, route}) {
      if (!planId)
      console.warn('planId 为空')
      const {certainSteps, stepsCollection, stepRoutes} = state
      const step = findStep({stepRoutes, route})
      console.assert(step, `带步骤信息的路由列表中找不到路由：{name: ${route.name}}`)
      if (stepsCollection[planId]) {
        return Promise.resolve(stepsCollection[planId])
      } else if (certainSteps.includes(step.id)) {
        return Promise.resolve(certainSteps)
      } else {
        return dispatch(GET_REMOTE_STEPS, {planId})
      }
    }
  }
}
