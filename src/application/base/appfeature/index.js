/* - addinfo: 完善信息
* @Author: jankergg
* @Date:   2018-05-10 10:15:40
* @Last Modified by:   jankergg
* @Last Modified time: 2018-07-05 15:47:21
*/

const appFeature = {
  path: '/appfeature',
  name: 'app-feature',
  components: {
    default: resolve => require(['./main'], resolve)
  },
  Info: {
    description: '产品详情'
  },
  meta: {
    requireAuth: true,
    title: '',
    leftMenu: {
      title: '返回',
      javascript: 'closeAppFeature'
    }
  }
}
export default appFeature;
