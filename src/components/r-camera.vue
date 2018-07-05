<template>
  <r-btn none :class="css.component" @click="onClick">
    <r-icon name="camera"/>
    <input v-if="h5" type="file" accept="image/*" :multiple="multiple" :class="css.input" @change="h5Upload">
  </r-btn>
</template>
<script>
  import RBtn from './r-btn'
  import RIcon from './r-icon'
  import {mapGetters} from 'vuex'
  import {toast} from 'src/widget/util/currying'
  import UploadService from '../service/UploadService'
  export default {
    name: 'RCamera',
    components: {
      RBtn, RIcon
    },
    props: {
      multiple: Boolean,
      limit: Number
    },
    computed: {
      ...mapGetters(['h5'])
    },
    methods: {
      onClick () {
        if (!this.h5) this.nativeUpload()
      },
      nativeUpload () {
        const {limit} = this
        if (limit === 0) {
          toast(`上传已达到最大数量`)
          return
        }
        window.callCameraMultiple(limit || 1).then(result => {
          let images = JSON.parse(result) || []
          this.report(images.map(it => it.url))
        }).catch(error => {
          toast('上传失败')
          console.error(error)
        })
      },
      h5Upload (event) {
        const {files} = event.target
        const {limit} = this
        if (files.length === 0) return
        if (this.multiple) {
          if (limit === 0) {
            return toast(`上传已达到最大数量`)
          }
          if (files.length > limit) {
            return toast(`最多只能再上传${limit}张`)
          }
          if (files.length > 9) {
            return toast(`单次最多只能上传9张`)
          }
        }
        UploadService.uploadFiles(files).then(this.report, () => toast('图片上传失败'))
      },
      report (images) {
        this.$emit('camera', images)
      }
    }
  }
</script>
<style module="css" lang="less">
  .component {
    position: relative;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .input {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
  }
</style>
