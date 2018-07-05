const ID = typeof Symbol === 'function' ? identify => Symbol(identify) : identify => identify
// 一个枚举集，所有代码可能运行的环境
const Env = {
  App: ID('App'), // 要能访问jsBridge才算App
  H5: ID('H5') // App外的环境现在都归作H5
}
Object.freeze(Env)
export default Env
