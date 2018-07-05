// 内联(即不代码拆分)的视图包裹组件

export const mainView = {
  template: '<router-view/>',
  name: 'MainView'
}

export const aliveView = {
  template: '<keep-alive><router-view/></keep-alive>',
  name: 'AliveView'
}

export const asideView = {
  template: '<router-view name=sidebar />',
  name: 'AsideView'
}
