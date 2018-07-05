import '../../assets/styles/weui/base/reset.less'
import '../../assets/styles/weui/widget/weui_cell/weui_cell_global.less'
import Vue from 'vue'
import router from './router'
import store from 'src/store'
import vuexI18n from 'vuex-i18n'
import {translationsFan, translationsEn} from 'src/language'
import { AlertPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin } from 'vformer'
import baseMixin from '../base/mixin'
import 'src/widget/filter'
import 'src/widget/http'

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.config.productionTip = false

// 点击延迟
const FastClick = require('fastclick')
FastClick.attach(document.documentElement)

Vue.use(vuexI18n.plugin, store)
Vue.i18n.add('FAN', translationsFan)
Vue.i18n.add('EN', translationsEn)
Vue.i18n.set('FAN')
Vue.mixin(baseMixin)

const Share = new Vue({
  name: 'Share',
  el: '#app',
  router,
  store,
  template: '<router-view/>'
})
