<template>
  <r-btn none :class="css.component" @click="onClick">
    <r-icon :name="iconName" />
    <template v-if="useH5">
      <input v-if="isCamera" type="file" accept="image/*" capture="camera" :class="css.input" @change="h5Upload">
      <div v-transfer-dom>
        <xxs-sign v-if="show && isSign" :options="options" @finish="h5Sign"/>
        <xxs-commit v-if="show && isCommit" :options="options" @finish="h5Commit"/>
      </div>
    </template>
  </r-btn>
</template>
<script>
  import CATypes from 'src/data/CATypes'
  import RBtn from './r-btn'
  import RIcon from './r-icon'
  import XxsCommit from './xxs/xxs-commit'
  import XxsSign from './xxs/xxs-sign'
  import TransferDom from 'src/directives/transfer-dom'
  import {mapGetters} from 'vuex'
  import UploadService from 'src/service/UploadService'
  import chain from 'src/utils/chain'
  import {toast} from 'src/widget/util/currying'

  export default {
    name: 'RSign',
    model: {
      prop: 'model',
      event: 'update'
    },
    components: {
      XxsSign,
      XxsCommit,
      RBtn,
      RIcon
    },
    directives: {
      TransferDom
    },
    props: {
      model: {
        type: Object
      }
    },
    data () {
      return {
        show: false
      }
    },
    computed: {
      ...mapGetters(['h5']),
      useH5 () {
        return this.h5 || this.cType === CATypes.Gesture
      },
      isCamera () {
        const {cType} = this.model
        return cType === CATypes.Gesture || cType === CATypes.Photo
      },
      iconName () {
        return this.isCamera ? 'camera' : 'sign'
      },
      isSign () {
        return this.model.cType === CATypes.Sign
      },
      isCommit () {
        return this.model.cType === CATypes.Commit
      },
      options () {
        const {model} = this
        return {...model, ...model.keyWordRule, keyWordRule: null}
      }
    },
    methods: {
      chain,
      onClick () {
        if (this.useH5) {
          this.show = true
        } else {
          this.nativeSign()
        }
      },
      h5Sign (res) {
        this.show = false
        if (!res) return
        Promise.all([this.uploadPng(res.value), this.uploadPkg(res.gem)])
          .then(([signImgPath, signPkgPath]) => this.update({signImgPath, signPkgPath})).catch(toast)
      },
      h5Commit (value) {
        this.show = false
        if (!value) return
        this.uploadPng(value).then(signImgPath => this.update({signImgPath})).catch(toast)
      },
      h5Upload (event) {
        const {files} = event.target
        if (!files.length) return
        if (this.model.cType === CATypes.Gesture) {
          const {title, certNo} = this.model
          UploadService.compress(files[0]).then(UploadService.uploadBase64).then(photoPath => {
            return UploadService.verifyCert({name: title, idNo: certNo, image: photoPath}).then(faceFlag => {
              toast('人脸识别成功~')
              this.update({photoPath, faceFlag})
              return Promise.resolve({photoPath, faceFlag})
            })
          }).then(null, () => toast('人脸识别失败~'))
        } else {
          UploadService.uploadFile(files[0]).then(photoPath => this.update({photoPath}))
        }
      },
      uploadPng (base64) {
        return UploadService.uploadPng(base64)
      },
      uploadPkg (base64) {
        return UploadService.uploadGem(base64, 'application/json')
      },
      nativeSign () {
        const {certNo, keyWordRule, cType, name} = this.model
        const serialized = JSON.stringify({...keyWordRule, certNo})
        window.caSign(name, cType, serialized).then(result => {
          const res = JSON.parse(result)
          let {signImgPath, signPkgPath, photoPath, faceFlag} = this.model
          switch (cType) {
            case 1:
              signImgPath = res.gestureImage // 签名 url
              signPkgPath = res.signData // 签名加密包的路径
              break
            case 2:
              photoPath = res.captureImage // 拍照url
              break
            case 3:
              if (res.IDRecognizeResult === '0') { // failed
                faceFlag = "1"
              }
              photoPath = res.gestureImage // 人脸识别url
              break
            case 4:
              signImgPath = res.gestureImage
              break
          }
          this.update({signImgPath, signPkgPath, photoPath, faceFlag})
        }).catch(e => {
          console.error(e)
        })
      },
      update (append) {
        this.$emit('update', {...this.model, ...append})
      }
    }
  }
</script>
<style module="css" lang="less">
  .component {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    position: relative;
  }

  .input {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
  }
</style>
