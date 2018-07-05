<!--
  使用native图片上传（多项),对应于其它资料和证件影像上传
-->
<template>
  <div class="hq-gather-multiple">
    <div class="bar-title">
      <div v-if="richTitle" class="title-rich">
        <h3>
          <span>{{customerName}}</span>
          <label :class="customerType.code">{{customerType.name}}</label>
        </h3>
        <p>
          <small>{{certType}}</small>
          <small>{{certNo}}</small>
        </p>
      </div>
      <h3 v-else>{{name}}</h3>
      <r-camera @camera="gather" multiple :limit="limit" v-if="editable && !transferToChild" class="btn-camera"/>
    </div>
    <template v-if="transferToChild">
      <template v-for="(it, index) in subList">
        <r-gather-multiple v-model="subList[index]" @update="update({})"/>
      </template>
    </template>
    <template v-else>
      <div class="list-preview" v-if="hasImage">
      <span v-for="(image,index) in images" class="item" :key="index">
        <r-icon name="x" @click="remove(index)" class="icon-remove"/>
        <em>
          <img :src="image.url" @click="enlarge(image)"/>
        </em>
      </span>
      </div>
    </template>
    <div class="tips" v-if="tips">{{tips}}</div>
  </div>
</template>
<script>
  import {isArray, clone} from 'src'
  import RCamera from './r-camera'
  import RIcon from './r-icon'

  export default {
    name: 'RGatherMultiple',
    model: {
      event: 'update',
      prop: 'model'
    },
    components: {
      RCamera, RIcon
    },
    props: {
      model: {
        type: Object,
        default () {
          return {}
        }
      },
      richTitle: Boolean,
      transferToChild: Boolean,
      multiple: {
        type: Boolean,
        default () {
          return true
        }
      }
    },
    computed: {
      customerName: {
        get () {
          return this.model.customerName
        }
      },
      name: {
        get () {
          return this.model.name
        }
      },
      tips: {
        get () {
          return this.model.tips
        }
      },
      customerType: {
        get () {
          const {customerType} = this.model
          return ({
            1: {name: '投保人', code: 'applicant'},
            2: {name: '被保险人', code: 'insurant'},
            3: {name: '受益人', code: 'beneficiary'}
          })[customerType]
        }
      },
      certNo: {
        get () {
          return this.model.certNo
        }
      },
      certType: {
        get () {
          return this.model.certType
        }
      },
      editable: {
        get () {
          const {model: {maxNum}, images} = this
          return (images || []).length < maxNum
        }
      },
      images: {
        get () {
          return this.model.imagePathList || []
        },
        set (imagePathList) {
          this.update({imagePathList})
        }
      },
      limit () {
        return this.model.maxNum - this.images.length
      },
      hasImage: {
        get () {
          return this.images && this.images.length > 0
        }
      },
      subList: {
        get () {
          return this.model.imageInfo
        },
        set (imageInfo) {
          console.log('update subList')
          this.update({imageInfo})
        }
      }
    },
    methods: {
      update (append) {
        this.$emit('update', {...this.model, ...append})
      },
      gather (urlArray) {
        let images = clone(this.images) || []
        this.images  = images.concat(urlArray.map(url => ({url})))
      },
      // 移除图片
      remove (index) {
        const images = clone(this.images)
        images.splice(index, 1)
        this.images = images
      },
      // 放大图片
      enlarge ({url}) {
        window.articleDetail(url)
      }
    }
  }
</script>
<style lang='less'>
	@import url("~@/assets/styles/page.less");
  .hq-gather-multiple{
    width: 100%;
    box-sizing: border-box;
    padding: 8px 0;
    position: relative;

    & &::before{
      .setTopLine();
    }
    .bar-title {
      display: flex;
      align-items: center;
      > h3 {
        line-height: 45px;
        height: 45px;
        font-weight: normal;
        font-size: 1em;
        margin: 0;
      }
      > .title-rich, > h3{
        flex: 1;
      }

      + .hq-gather-multiple {
        margin-top: 8px;
      }
    }
    .title-rich {
      padding-top: 5px;
      padding-bottom: 5px;
      > h3, > p{
        display: flex;
      }
      > h3 {
        font-weight: normal;
      }
      h3{
        color: #333;
        font-size: 15px;
        font-weight: normal;
      }
      h3, p{
        line-height: inherit;
        margin:0;
        align-items: center;
      }
      label{
        display:inline-block;
        border-radius: 3px;
        font-size: 12px;
        color: white;
        padding: 0 5px;
        margin-left: 12px;
        line-height: 17.5px;
        height: 17.5px;
      }
      /*投保人*/
      .applicant{
        background-color: @btnBlue;
      }
      /*被保人*/
      .insurant{
        background-color: @bgGreen;
      }
      /*受益人*/
      .beneficiary{
        background-color: @yellowLight;
      }
      small{
        color:#999;
        font-size: 13px;
      }
      small + small {
        margin-left: 12px;
      }
    }
    .btn-upload {
      width: 25px;
      height: 25px;
      display: flex;
      padding: 5px;
      > i {
        flex: 1;
      }
    }
    .list-preview{
      line-height: 0;
      margin-bottom: 10px;
      &::after{
        content: ' ';
        clear: both;
        display: block;
        line-height: 0;
        height: 0;
      }
      &:empty::after{
        content:'';
        clear: none;
      }
      .item{
        float: left;
        margin:8px 8px 8px 0;
        width: 50px;
        height: 50px;
        position: relative;
        z-index: 0;
        > .icon-remove {
          position: absolute;
          display: block;
          top: -10px;
          right: -10px;
          width: 20px;
          height: 20px;
          z-index:1;
        }
        em{
          display: block;
          width: 50px;
          height: 50px;
          overflow: hidden;
        }
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .tips {
      font-size: 12px;
      color: @btnBlue;
      line-height: 1.75;
      padding: 0;
      margin-top: -10px;
    }

    .btn-camera {
      margin-right: 8px;
    }
  }
</style>
