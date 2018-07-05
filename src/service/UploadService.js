import Service from './Service'
import opacify from '../utils/opacify'
import {compress} from '../utils/compressor'
import base64ToBlob from '../utils/base64ToBlob'
import {UPLOAD, VERIFY_CERT} from 'src/api'
import axios from 'axios'


export default class UploadService extends Service {
  static compress = compress
  static send (blob) {
    const formData = new FormData()
    formData.append('file', blob)
    return Service.post(UPLOAD, formData).then(({url: [url]}) => url)
  }
  static uploadPng (base64) {
    // opacify函数这儿将png转换成jpeg，同时压缩和生成了blob对象，(然后才可以使用FormData上传)
    return opacify(base64, 'blob').then(UploadService.send)
  }
  static uploadGem (data, type) {
    return UploadService.send(new Blob([data], {type}))
  }
  static removeBase64Head (file = '') {
    return file.replace(/^data:image\/([^;]+);base64,/, '')
  }
  // 人脸识别
  static verifyCert ({name, idNo, image}) {
    const payload = {idNo, name, image}
    return axios.post(VERIFY_CERT, payload).then(({data: {success, errorMsg, value}}) => {
      if (success) {
        return Promise.resolve(0)
      } else {
        return Promise.reject(errorMsg)
      }
    })
  }
  static fileToArrayBuffer (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.addEventListener('error', function () {
        reject(reader.error)
      })
      reader.addEventListener('load', function () {
        resolve(reader.result)
      })
      reader.readAsArrayBuffer(file)
    })
  }
  static fileToBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.addEventListener('error', function () {
        reject(reader.error)
      })
      reader.addEventListener('load', function () {
        resolve(reader.result)
      })
      reader.readAsDataURL(file)
    })
  }
  static uploadBase64 (base64, contentType = 'image/png', sliceSize) {
    return UploadService.send(base64ToBlob(base64, contentType, sliceSize))
  }
  static uploadFile (file) {
    return UploadService.send(file)
  }
  static uploadFiles (files) {
    return Promise.all(Array.from(files, UploadService.send))
  }
}
