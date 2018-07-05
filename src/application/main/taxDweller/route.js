
export default {
  path: '/taxDweller',
  name: 'tax-dweller',
  component: () => import('./index'),
  meta: {
    requireAuth: true,
    title: '税收居民',
    leftMenu: {
      title: '返回',
      javascript: 'gobackbtn'
    }
  },
  Info: {
    description: '税收居民'
  },
}
