<!--
  图片(签名)采集
-->
<template>
  <div class="r-gather">
    <h3>
      <span>{{model.desc}}</span>
      <r-sign :model="model" @update="update"/>
    </h3>
    <div class="list-preview" v-if="hasImage">
      <span class="item">
        <r-icon name="x" @click="remove" class="icon-remove"/>
        <em>
          <img :src="image" @click="enlarge"/>
        </em>
      </span>
    </div>
    <div class="tips" v-if="model.tips">{{model.tips}}</div>
  </div>
</template>
<script>
  import RSign from './r-sign'
  import RIcon from './r-icon'
  import {mapGetters} from 'vuex'
  import CATypes from 'src/data/CATypes'
  export default {
    name: 'RGather',
    components: {
      RSign, RIcon
    },
    model: {
      event: 'update',
      prop: 'model'
    },
    props: {
      model: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      ...mapGetters(['inApp']),
      image: {
        get () {
          const {model, model: {cType}} = this
          return (cType === CATypes.Sign || cType === CATypes.Commit) ? model.signImgPath : model.photoPath
        }
      },
      hasImage: {
        get () {
          return !!this.image
        }
      }
    },
    methods: {
      // 更新model
      update (model) {
        this.$emit('update', {...this.model, ...model})
      },
      // 移除图片
      remove () {
        switch (this.model.cType) {
          case CATypes.Sign:
            this.update({
              signImgPath: null,
              signPkgPath: null
            })
            break
          case CATypes.Photo:
            this.update({
              photoPath: null
            })
            break
          case CATypes.Gesture:
            this.update({
              photoPath: null,
              faceFlag: null
            })
            break
          case CATypes.Commit:
            this.update({
              signImgPath: null
            })
            break
          default:
            break
        }
      },
      // 放大图片
      enlarge () {
        if (this.inApp) {
          window.articleDetail(this.image)
        }
      }
    }
  }
</script>
<style lang=less>
  .r-gather{
    padding-bottom: 1px;

    > h3 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 5px;
      font-weight: normal;
      color: inherit;
      margin: 0;
      font-size: 1em;
      height: 40px;
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

        .icon-remove {
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
      color: #00b0ff;
      line-height: 1.75;
      padding: 0;
      margin-top: -10px;
    }
  }
</style>
