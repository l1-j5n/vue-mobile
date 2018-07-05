import clone from 'src/utils/clone'
let cache = {}
const localStorageAvailable = !! window.localStorage
const getCacheItem = function (key) {
  return key ? clone(cache[key]) : void 0
}
const getStorageItem = function (key) {
  const serializedValue = localStorage.getItem(key)
  return serializedValue ? JSON.parse(serializedValue) : void 0
}
const setCacheItem = function (key, value) {
  cache[key] = clone(value)
}
const setStorageItem = function (key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
const clearCache = function () {
  cache = {}
}
const clearStorage = function () {
  localStorage.clear()
}
const store = {
  getItem: localStorageAvailable ? getStorageItem : getCacheItem,
  setItem: localStorageAvailable ? setStorageItem : setCacheItem,
  clear: localStorageAvailable ? clearStorage : clearCache
}
Object.freeze(store)
export default store
