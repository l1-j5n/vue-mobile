<!--
  复杂告知页面
  -- simon,2018.05.28
-->
<template>
  <div id="insimpart" >
    <div class="tabs" v-if="Object.keys(impartList).length">
      <div class="tabs-bar">
    	  <a :class="[Object.keys(impartList).length<=3?'tabs-tab tabs-tab_3':'tabs-tab tabs-tab_4 ',index == currentIndex?'active':'']" v-for="(item,key,index) of impartList"
           target="showHere"  @click="handleChange(index,item)" :key="index">
        	<p>{{item['name']}}</p>
        </a>
      </div>
      <div  class="tabs-content">
        <div  v-for="(im,key,index) of impartList" :class="[currentIndex==index?'show':'hide']" :key="index+'ins'">
          <notifyFixed v-if="im.insurantImpartType != '03'" :notifyList="im['insurantImpart']"></notifyFixed>
          <iframe ref="notifyiframe" class="notify-frame" v-else-if="im.insurantImpartType == '03'" id="show-iframe"  frameborder=0 name="showHere" scrolling=auto :src="im.multiImpartAddress"></iframe>
        </div>
      </div>

    </div>

    <div v-if="displayBtn"   class="page__ft">
      <div class="btn-next" @click="nextStep(applyId)" v-if="Object.keys(impartList).length-1 == currentIndex">下一步</div>
      <div class="btn-next" @click="saveImpart(currentIndex)" v-else>保存</div>
    </div>

  </div>
</template>

<script>
import { INITAPPLICANTANDINSURANTINFORM, SAVESINGLEINSURANTIMPART } from '@/api'
import notifyFixed from '../notify-fixed/notify-fixed.vue'
import {mapActions} from 'vuex'
import store, {ACTION} from 'src/store'
export default {
  name: 'notify-ins',
  data() {
    return {
      html:'www.baidu.com',
      iframeState:false,
    	// 接口所有数据
      impartData: {},
      // 当前tab索引
      currentIndex: 0,
      // 所有被保人告知伪数组
      impartList:{},
      applyId:this.$route.query.applyId||'',
      localstock:null
    }
  },
  created() {

    if(window.localStorage.getItem('notifyrecord')){
      this.localstock = JSON.parse(window.localStorage.getItem('notifyrecord'));
    }
    this.getData(this.$route.query.applyId)

    window.gotoViewinsurerpact = ()=>{
      this.$router.push({path:'/viewinsurerpact',query:{
        applyId:this.$route.query.applyId || ''
      }})
    }

  },
  computed: {
      displayBtn: {
        get () {
          console.log('get',Object.keys(this.impartList))
          if(Object.keys(this.impartList).length>0 && this.impartList[this.currentIndex].insurantImpartType == '03')
            return false;
          return true;
        }
      }
  },
  methods: {

    getData(applyId) {
      let currentIndex = this.currentIndex
      this.axios.post(INITAPPLICANTANDINSURANTINFORM, { applyId: applyId }).then(({ data }) => {
      	if(!data.success){
      		this.__toast(data.errorMsg)
      		return
      	}
      	this.impartData = data.value
        if (data.value && data.value.insurants && data.value.insurants[currentIndex]) {
        	let temp = {}
        	data.value.insurants.map((item,key)=>{
        		item['insurantImpart'] = (typeof item.insurantImpart==='string')?JSON.parse(item.insurantImpart):item.insurantImpart

            //test
//            if(key==0){
//              item['insurantImpartType'] = '03';
//              item['multiImpartAddress'] = '/notify/transition';
//
//              if(this.localstock != null){
//                item['multiImpartAddress'] = this.replaceImg(item);
//                console.log('getdata_localstock',this.localstock)
//              }
//            }
            //test

        		temp[key] = item
        	})
        	this.impartList = temp
          console.log('impartList',this.impartList)
          this.$nextTick(()=>{
//        	  console.log(this.$refs.notifyiframe.)
          })
        } else if (data.errorMsg) {
          this.__toast(data.errorMsg)
        }
      })
    },
    replaceImg(item){
      let imgReplace = ''
      for(let i in item){
        this.localstock.seq.forEach((seq)=>{
            if(i=='insureSeq' && item[i]==seq.insureSeq){
              item['multiImpartAddress'] = '/notify/grade?impartType='+seq.impartType+'&insureSeq='+seq.insureSeq;
            }
        })
      }

      return item['multiImpartAddress'];
    },
    handleChange(index,item) {

      if(window.localStorage.getItem('notifyrecord')){
        this.localstock = JSON.parse(window.localStorage.getItem('notifyrecord'));
        this.impartList[this.currentIndex].multiImpartAddress = this.replaceImg(item);
      }


      console.log('item',item);

      if (this.currentIndex != index) {
        // 保存当前告知
        this.saveImpartData(this.currentIndex, '', () => {
          this.currentIndex = index
        })
      }
    },
    saveImpart(index){
    	this.saveImpartData(index,'',()=>{
    		this.__toast('保存成功')
    	})
    },
    /**
     * index--被保人索引, checkFlag--是否是下一步, callback--成功回调
     */
    saveImpartData(index, checkFlag, callback) {
      let impartList = this.impartList

      if(impartList[index].insurantImpartType == '03'){
        if(this.localstock && this.localstock.statis.indexOf(index+1) != -1){
          callback && callback()
          return;
        }
        else{
          this.$vux.toast.show({
            text: '请填写健康告知信息',
            type: 'text',
            width: '50%',
            isShowMask: true
          })
          return;
        }
      }


      let subData = {}
      let inputImpart = this.getChildImpartData()
      if (!inputImpart) {
        return
      }
      Object.keys(impartList).map((item, key) => {
        if (index == key) {
          subData.applyId = this.applyId
          subData.insurant = {
            "insurantImpart": JSON.stringify(inputImpart),
            "insureSeq": impartList[item].insureSeq
          }
        }
      })
      //如果是最后一个被保人，就是下一步
      if (checkFlag) {
        subData['checkFlag'] = checkFlag
      }
      this.axios.post(SAVESINGLEINSURANTIMPART, subData).then(({ data }) => {
        if (data.success) {
          //保存成功后回调将当前索引切换到点击的被保人上
          callback && callback()
        }else{
        	this.__toast(data.errorMsg)
        }
      })
    },
    // 获取子组件告知录入信息
    getChildImpartData() {
      for (var i = 0; i < this.$children.length; i++) {
        // 获取当前被保人的告知节点
        if (this.currentIndex === i) {
          let chl = this.$children[i]
          let tempResult = chl.getImpartValidate && chl.getImpartValidate()
          if (tempResult) {
            return tempResult
          }
        }
      }
    },
    nextStep() {
      this.saveImpartData(this.currentIndex, 'Y',()=>{
      	const planId = this.impartData.planId
        const query = {...this.$route.query, planId}
      	// this.$router.push({name:'view-insurerpact',query:query})
        const route = this.$route
        store.dispatch(ACTION.GET_ROUTE_NEXT, {planId, route}).then(nextRoute => {
          this.$router.push({...nextRoute, query})
        })
      })
    }
  },
  components: {
    notifyFixed
  }
}
</script>
<style lang='less'>
@import "../../../../assets/styles/notify/notify.less";
#insimpart{
  /*padding-bottom: 50px;*/
  background: #efeff4;
  height:100%;
  overflow:auto;
  .page__ft {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .tabs-tab_3{
  	&.active{
	    width: 138/2px;
	    height: 150/2px;
	    background: url(~@/assets/styles/images/tab_3.png);
	    background-size: 100% 100%;
	    color: rgba(255, 255, 255, 1);
	    & > p {
	      width: 80%;
	    }
  	}
  }
  .tab-tab_4.active{
    width: 114/2px;
    height: 123/2px;
    background: url(~@/assets/styles/images/tab_4.png);
    background-size: 100% 100%;
    color: rgba(255, 255, 255, 1);
    & > p {
      width: 80%;
    }
  }
  .tabs{
    height:100%;

      /*height:100%;*/
      .tabs-bar{
        /*height: 18%;*/
      }
      .tabs-content{
        height:100%;
      >div{
      &.hide{
         display: none;
       }
      &.show{
         display: block;
          height: 100%;
          .notify-frame{
            width: 100%;
            height: 100%;
          }
       }
      }

      }


  }
}
</style>
