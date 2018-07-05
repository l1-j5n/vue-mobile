<!--
  分级告知
  -- simon,2018.05.28
-->
<template>
  <div id="hierarchy-notify">

    <div class="title">
      <tabs
        :insurantList="inslist"
        :selected="0"
        label="label"
        @onSelect="onSelect">
      </tabs>
    </div>

    <div class="pronounce">
      <div class="content">
        1. 正常承保

        所谓正常承保就是，我们如实反馈我们的健康问题给到保险公司核保，保险公司通过核保，觉得告知的健康状态对投保的影响不大，保险公司愿意正常承保。

        案例：张女士，有轻微乙肝病毒携带，在投保重疾险时，发现健康告知对这一块儿有要求，所以不能正常承保，要经过保险核保。保险公司根据张女士提供的体检报告发现她确实有轻微乙肝病毒携带，但是肝功能一切正常，符合承保条件，可以正常承保。这样张女士在保险公司对健康状况作一个备案后，通过保险公司核保就可以正常投保重疾险了！

        2. 延期承保

        所谓延期承保就是，保险公司经过核保认为被保险人当前的身体健康状况是不符合承保条件的，需要等到恢复健康之后，经过医院复查没有任何健康状况的情况下再去投保。

        案例：李先生想投保一份重大疾病保险，填写健康告知发现有问到：被保险人最近五年内是否接受过住院治疗。而李先生前期因为阑尾炎在医院接受了手术治疗需要经过保险公司走核保，保险公司核保发现李先生刚出院没多多久，身体还没有完全康复不符合承保条件，需要等身体完全康复才能投保。这样，李先生需要经过一段时间，等身体完全康复之后，去医院作一个复查，身体完全健康了才能正常投保这款重疾产品！

        3. 单项免责承保

        单项免责条款，很容易理解：就是当我们身体某一器官处于亚健康状况，引发跟这器官相关的重疾概率很大，但是除此之外，其他健康状况没有任何问题。这时通过保险公司核保评估他的健康状况之后，决定如果免除当前处于亚健康的器官可能引发的重疾责任外，针对其他方面的重疾保险公司可以正常承保。

        案例：王先生，因为有小三阳不能正常投保，但是又想要投保健康保险，所以走保险公司核保。保险公司根据王先生提供的检查报告发现由于王先生有小三阳所以他发生急性或者亚急性重症肝炎等肝方面疾病的概率相当高，保险公司作了一个风险评估后不愿意承保王先生这方面的重疾风险，如果王先生想要投保，就必须免除肝部疾病的责任，以后因为肝部的疾病出险是不能正常获得理赔的，而其他部位的疾病出险是可以正常获得理赔的。
      </div>
    </div>

    <div class="board">
      <div class="banner">部分为是</div>
      <div class="content-section">
        <div class="title">健告内容</div>
        <div class="question">问题1：最近两年是否接受过手术？</div>
        <div class="answer">答案：是</div>
      </div>
    </div>

    <div class="modifybtn" @click="gotohierarchy()">
      修改分级健告
    </div>

    <div class="page__ft">
      <div class="weui-btn weui-btn_primary nextstep" @click="nextstep()">下一步</div>
    </div>
  </div>
</template>

<script>
import { INITAPPLICANTANDINSURANTINFORM, SAVESINGLEINSURANTIMPART } from '@/api'
import notifyFixed from '../notify-fixed/notify-fixed.vue'
import tabs from "@/components/tab/tabs2";
export default {
  name: 'notify-grade',
  data() {
    return {
      inslist:[
        {label:'父母',name:'0'},
        {label:'子女',name:'1'}
      ],
      currentTab:0,

      impartData: {},
      record:{},
      impartType:-1,
      insureSeq:-1
    }
  },
  created() {
//    this.getData(this.$route.query.applyId)
    this.fatherMark();
  },
  methods: {
    gotohierarchy(){
      this.$router.push({name:'transition',query:{
        planId:this.$route.query.planId || '',
        applyId:this.$route.query.applyId || ''
      }})
    },
    nextstep(){
      parent.gotoViewinsurerpact()
    },
    onSelect(v) {
      this.currentTab = v;
    },
    fatherMark(){
      this.impartType = this.$route.query.impartType;
      this.insureSeq = this.$route.query.insureSeq;
      if(window.localStorage.getItem('notifyrecord')){
        let record = JSON.parse(window.localStorage.getItem('notifyrecord'));
        if(record.type == '02'){
          if(record.statis.indexOf(this.insureSeq) == -1){
            record.seq.push(this.$route.query);
            record.statis.push(this.insureSeq);
            window.localStorage.setItem('notifyrecord',JSON.stringify(record));
          }
        }
      }
      else{
        window.localStorage.setItem('notifyrecord',JSON.stringify({
          type:this.impartType,
          seq:[this.$route.query],
          statis:[this.insureSeq]
        }))
      }
    },
    getData(applyId) {
      this.axios.post(INITAPPLICANTANDINSURANTINFORM, { applyId: applyId }).then(({ data }) => {

      })
    },
    nextStep() { }
  },
  components: {
    notifyFixed,
    tabs
  }
}
</script>
<style lang='less'>
@import "../../../../assets/styles/weui/widget/weui-button/weui-button";
@import "../../../../assets/styles/notify/notify.less";
#hierarchy-notify{
  padding-bottom: 50px;
  background: #efeff4;
  .page__ft {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .pronounce{
    .content{
      padding:0 10px;
    }
  }

  .board{
    background-color:#fff;
    margin:10px;
    border-radius:5px;
    padding-left:10px;
    .banner{
      color:#7292a8;
      padding: 10px 10px;
    }
    .content-section{
      padding: 10px 10px;
      padding-top:0px;
      .title{
        color:#c6c6c6;
      }
      .question{
        color:#616161;
      }
      .answer{
        color:#616161;
      }
    }
  }
  .modifybtn{
    margin:0 auto;
    background-color: #fff;
    border-radius: 5px;
    color:#7b90aa;
    width: 100px;
    height: 30px;
    line-height: 30px;
    border:1px solid #7b90aa;
    text-align: center;
  }

  .nextstep{
    background: linear-gradient(to right,#73a5f7,#2962e2);
  }
}
</style>
