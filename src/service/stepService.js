import StepTypes from '../data/StepTypes'
import {STEPS} from '../api'
import axios from 'axios'
import {isArray} from 'src/utils'

const stepMapper = {
  1: StepTypes.CustomerBasic,
  3: StepTypes.JoinProduct,
  4: StepTypes.PreviewAssurances,
  10: StepTypes.CompleteCustomer,
  11: StepTypes.JoinBeneficiaries,
  13: StepTypes.ApplicantNotify,
  14: StepTypes.InsuredNotify,
  // 15: StepTypes.AgentNotify, // 没有代理人告知
  16: StepTypes.PreviewApplication,
  17: StepTypes.ESign
}

const stepTypeMapper = Object.keys(stepMapper).reduce((map, key) => {
  map[stepMapper[key]] = parseInt(key)
  return map
}, {})

const stepAdapter = function (list) {
  return list.map(id => {
    console.assert(stepMapper[id], `请在stepService中添加数字'${id}'所代表的步骤！`)
    return stepMapper[id]
  })
}

export const getSteps = function ({planId}) {
  return axios.post(STEPS, {planId}).then(({data: {success, errorMsg, value}}) => {
    return success ? Promise.resolve(stepAdapter(value)) : Promise.reject(errorMsg)
  })
}

// 从路由配置中萃取出步骤相关的数据项 routes -> stepRoutes
const build = function (routes) {
  const addPathPrefix = path => {
    return (path === '' || path === '/') ? path : ('/' + path)
  }
  return routes.reduce(function (stepRoutes, route) {
    // 一个路由被定义为了一个步骤，则它的子路由不能也成为一个步骤
    const {step, children = []} = route
    if (step) {
      stepRoutes.push({
        id: step.id,
        title: step.name,
        name: route.name,
        path: route.path,
        children: children.map(child => {
          return {
            name: child.name,
            path: route.path + addPathPrefix(child.path)
          }
        })
      })
    } else {
      children.forEach(child => {
        let {step} = child
        if (step) {
          stepRoutes.push({
            id: step.id,
            title: step.name,
            name: child.name,
            path: route.path + addPathPrefix(child.path)
          })
        }
      })
    }
    return stepRoutes
  }, [])
}

const findStepByName = function ({stepRoutes, name}) {
  let nearerTarget = null
  const target = stepRoutes.find(step => {
    return step.name === name ||
      (step.children && step.children.find(child => {
        const inChildren = child.name === name
        if (inChildren) {
          nearerTarget = {...child, id: step.id}
        }
        return inChildren
      }))
  })
  return nearerTarget || target
}

const findStepIndexByName = function ({stepRoutes, name}) {
  return stepRoutes.findIndex(step => {
    return step.name === name || (step.children && step.children.find(child => child.name === name))
  })
}

const findStepByPath = function ({stepRoutes, path}) {
  let nearerTarget = null
  const target = stepRoutes.find(step => {
    return step.path === path ||
      (step.children && step.children.find(child => {
        const inChildren = child.path === path
        if (inChildren) {
          nearerTarget = {...child, id: step.id}
        }
        return inChildren
      }))
  })
  return nearerTarget || target
}

const findStepIndexByPath = function ({stepRoutes, path}) {
  return stepRoutes.findIndex(step => {
    return step.path === path || (step.children && step.children.find(child => child.path === path))
  })
}

export const findStep = function ({stepRoutes, route}) {
  const {name, path} = route
  if (name) return findStepByName({stepRoutes, name})
  if (path) return findStepByPath({stepRoutes, path})
}

export const findStepIndex = function ({stepRoutes, route}) {
  const {name, path} = route
  if (name) return findStepIndexByName({stepRoutes, name})
  if (path) return findStepIndexByPath({stepRoutes, path})
}

const getIdValue = function (stepType) {
  return stepTypeMapper[stepType]
}

const sortByStepOrder = function (a, b) {
  return getIdValue(a.id) > getIdValue(b.id)
}

// 从路由数组中萃取出步骤信息，并验证步骤信息的有效性
export const pluckRoutes = function (routes) {
  const steps = build(routes).sort(sortByStepOrder)
  Object.values(stepMapper).forEach(function (predefineStep) {
    const hasStep = steps.find(step => {
      return step.id === predefineStep || (step.children && step.children.find(child => child.step && child.step.id === predefineStep))
    })
    console.assert(hasStep, `在路由表中找不到步骤 '${predefineStep.toString()}' 所关联的路由！`)
  })
  return steps
}

// 分组带步骤信息的路由 routes是带步骤信息的路由， groups是分组信息
export const groupRoutes = function ({routes, groups}) {
  const rich = stepId => routes.find(route => route.id === stepId)
  return groups.map(group => {
    const {name} = group
    const step = group.step ? rich(group.step) : null
    const steps = group.steps ? group.steps.map(rich) : null
    return {name, step, steps}
  })
}
