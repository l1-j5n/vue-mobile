<!--
  使用native图片上传（多项),对应于其它资料和证件影像上传
  应用于多被保人
-->
<template>
  <div>
  	<div class="hq-gather-multiple ">
	    <div class="bar-title">
	      <div  class="title-rich">
	        <h3>
	          <span>{{customerName}}</span>
	          <label :class="customerType.code">{{customerType.name}}</label>
	        </h3>
	        <p>
	          <small>{{certType}}</small>
	          <small>{{certNo}}</small>
	        </p>
	      </div>
	    </div>
	  </div>
	  <!--证件列表-->
	  <div class="hq-gather-multiple vux-1px-t" v-for="(pItem,pKey) in imageInfo">
	    <div class="bar-title">
	      <h3>{{pItem.name}}</h3>
	      <span :class="getClass(pKey)" @click="gather(pKey)" >
	        <i class="camera"></i>
	      </span>
	    </div>
	    <div class="list-preview" v-if="pItem.imagePathList">
	      <span v-for="(image,index) in pItem.imagePathList" class="item" :key="index">
	        <i @click="remove(pKey,index)"></i>
	        <em>
	          <img :src="image.url" @click="enlarge(image.url)"/>
	        </em>
	      </span>
	    </div>
	  </div>
	  <div class="tips" v-if="tips">{{tips}}</div>
  </div>
</template>
<script>
  import clone from '@/widget/util/clone'
  import isArray from '@/widget/util'
  export default {
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
      },
      richTitle: {
        type: Boolean,
        default () {
          return false
        }
      },
      multiple: {
        type: Boolean,
        default () {
          return true
        }
      },
      insurantIndex: {
        type: Number,
        default () {
          return 0
        }
      },
    },
    data () {
      return {
        // model的镜像，因为连续发射update事件时，后续使用model时，model可能还没来得及更新
        cache: null
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
            2: {name: '被保人', code: 'insurant'},
            3: {name: '受益人', code: 'beneficiary'}
          })[customerType]
        }
      },
      imageInfo:{
      	get(){
      		return this.model.imageInfo
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
      images: {
        get () {
        	//数据模型model={imageInfo:[{imagePathList:[]}]}
          return this.model.imageInfo || []
        },
        set (imagePathList) {
          this.update(imagePathList)
        }
      }
    },
    methods: {
    	//返回每个证件是否是最大张数的class
    	getClass(index){
    		const model = this.model
    		if(model['imageInfo'][index]['imagePathList'] && model['imageInfo'][index]['imagePathList'].length >= model['imageInfo'][index]['maxNum']){
    			return 'hide'
    		}
    		return 'btn-upload'
    	},
      // 更新model[index].imageInfo.imagePathList;append=[{imagePathList:[]}]
      update (append) {
        // 当连续地emit update event时，后续创建更新payload时可能最新的数据还没有刷新，因此这里要使用快速缓存 this.cache
        const cached = !!this.cache
        let model = clone(cached ? this.cache : this.model)
        model['imageInfo'] = append
        this.cache = clone(model)
        this.$emit('update', model,this.insurantIndex)
      },
      // 上传图片到native，index--为imageInfo里的索引
      gather (index) {
      	//multiple吊起多张上传
        if (this.multiple) return this.gatherMultiple(index)
        window.callCamera().then(result => {
        	//设置imageInfo.imagePathList
          const appendImages = JSON.parse(result) || []
          let images = clone(this.images) || []
          images[index]['imagePathList']?'':images[index]['imagePathList']=[]
          images[index]['imagePathList'] = images[index]['imagePathList'].concat(appendImages)
          this.images = images
        }).catch(console.error)
      },
      // 从native处获取图片，多选模式
      gatherMultiple (index) {
        const {maxNum = 1} = this.model['imageInfo'][index]
        const len = this.images[index]['imagePathList']?this.images[index]['imagePathList'].length:0
        const num = Math.max(1, maxNum - len)
        window.callCameraMultiple(num).then(result => {
          const appendImages = JSON.parse(result) || []
          let images = clone(this.images) || []
          images[index]['imagePathList']?'':images[index]['imagePathList']=[]
          images[index]['imagePathList'] = images[index]['imagePathList'].concat(appendImages)
          this.images = images
        }).catch(console.error)
      },
      // 移除图片
      remove (pKey,index) {
        const images = clone(this.images)
        images[pKey]['imagePathList'].splice(index, 1)
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
    padding:8px 8px 8px 0;
    .sign {
      background: url("~@/assets/styles/images/sign/sign.png") no-repeat center;
      background-size: contain;
    }
    .camera {
      background: url("~@/assets/styles/images/sign/camera.png") no-repeat center;
      background-size: contain;
    }
    .bar-title {
      display: flex;
      align-items: center;
      > h3 {
        line-height: 45px;
        height: 45px;
        font-weight: normal;
      }
      > .title-rich, > h3{
        flex: 1;
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
    .hide{
    	display: none;
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
      margin-bottom: 0px;
      .item{
        float: left;
        margin:8px 8px 8px 0;
        width: 50px;
        height: 50px;
        position: relative;
        z-index: 0;
        > i{
          position: absolute;
          display: block;
          top: -10px;
          right: -10px;
          width: 20px;
          height: 20px;
          background: url('~@/assets/styles/images/sign/dele.png') no-repeat;
          background-size: contain;
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
  }
</style>
