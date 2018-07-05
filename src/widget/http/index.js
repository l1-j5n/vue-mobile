import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.timeout = 20000
if (process.env.NODE_ENV !== 'production'){
  axios.defaults.headers.common['token'] = 'tYgNVmxff4iPRHatOqS6ww=='
}

axios.postFrom = (uri, param) => {
  let params = new URLSearchParams()
  Object.keys(param).forEach((v, i, a) => {
    params.append(v, param[v])
  })
  return axios.post(uri, params)
}
export default function (app) {
  // http request 拦截器
  app.axios.interceptors.request.use(
    config => {
      // config.headers.token = ''
      // config.headers.common['MUserAgent'] = 'sssssss'
      // app.$store.dispatch('toggleLoadingStatus', true)
      // app.$vux.loading.show({
      //   text: 'Loading'
      // })
      app.$vux.loading.show()
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )

  // 添加响应拦截器
  app.axios.interceptors.response.use(function (response) {
    if (response.data.errorCode === '20000') {
      app.$router.push({path: '/login', query: {url: window.location.href, redirectUrl: window.location.href}})
    }
    // if (response.data.errorCode == 1 || response.data.errorCode == 112 || response.data.errorCode == 72) {
    //   app.$vux.toast.show({
    //     text: '请重新登录!',
    //     type: 'text',
    //     width: '50%',
    //     isShowMask: true,
    //     onHide () {
    //       window.closeWebview()
    //     }
    //   })
    // }
    // // 对响应数据做些事
    // app.$store.dispatch('toggleLoadingStatus', false)
    // app.$vux.loading.hide()
    app.$vux.loading.hide()
    return response
  }, function (error) {
    // 请求错误时做些事
    // app.$store.dispatch('toggleLoadingStatus', false)
    // let msg = '请求超时,请稍后再试'
    // app.$vux.toast.show({
    //   text: `${msg}`,
    //   type: 'text',
    //   width: '50%',
    //   isShowMask: true,
    //   onHide () {
    //     // window.closeWebview()
    //   }
    // })
    // app.$vux.loading.hide()
    app.$vux.toast.show({'text': '连接超时,请稍后再试'})
    app.$vux.loading.hide()
    return Promise.reject(error)
  })
}
