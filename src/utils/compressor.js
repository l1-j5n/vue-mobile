import Zip from 'src/library/zip'

const compressor = new Zip()
export default compressor
export const compress = function (file) {
  return compressor.run(file).then(({base64}) => {
    // 压缩失败，使用原图
    return base64 ? Promise.resolve(base64) : compressor.toDataURL(file)
  }, Promise.reject.bind(Promise))
}
