<!--
components: c_progressarticle
      name: c_progressarticle

    @event:
     C_Click: 点击事件

    #props:
        id: 文章id
   imgpath: 文章图片
     title: 文章title
      word: 文章正文

     &slot: default

    author: xx

  example:
        <c_article :id = "id"
                   :imgpath = "imgpath"
                   :title = "title"
                   :word = "word"
                   @C_Click = clickevent(n) n 文章为ID
        ></c_article>
-->
<template>
  <div class="progress-articlebox">
    <div class="progressarticle" v-if="imgpath">
      <div class="articlebox" @click="onClick">
        <div>
          <img :src="imgpath" />
        </div>
        <div><span>{{title}}</span>
          <span>投保人:{{applicant}}</span>
          <span>保费总计:{{paytotal}}</span>
        </div>
        <div>
          <span class="arrow_icon">{{tag}}</span>
        </div>
      </div>
      <div class="articlenav" v-if="showMenu !== 'hidden'">
        {{time}}
        <div>
          <button v-if="canEdit" @click = "eventEdit" class="eidt">编辑</button>
          <button v-if="canDele" @click = "eventDele">作废</button>
          <button v-if="canCopy" @click = "eventCopy">复制</button>
          <button v-if="inAirPay" @click = "eventDePay">收回支付</button>
          <button v-if="inAirSign" @click = "eventDeSign">收回签名</button>
          <button v-if="canPay" @click = "eventPay">支付</button>
          <button v-if="canView" @click = "eventView">查看</button>
        </div>
      </div>
    </div>
    <div class="progressarticle" v-else>
      <div class="articlebox2"  @click="onClick">
        <div>投保人:{{applicant}}</div>
        <div>
          <span class="arrow_icon">{{tag}}</span>
        </div>
      </div>
      <div class="articlenav" v-if="showMenu !== 'hidden'">
        {{time}}
        <div>
          <button v-if="canEdit" @click = "eventEdit" class="eidt">编辑</button>
          <button v-if="canDele" @click = "eventDele">作废</button>
          <button v-if="canCopy" @click = "eventCopy">复制</button>
          <button v-if="inAirPay" @click = "eventDePay">收回支付</button>
          <button v-if="inAirSign" @click = "eventDeSign">收回签名</button>
          <button v-if="canPay" @click = "eventPay">支付</button>
          <button v-if="canView" @click = "eventView">查看</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {AlertPlugin} from 'vformer'
  Vue.use(AlertPlugin)
  export default{
    name: 'c_progressarticle',
    props: ["id", "imgpath", "title", "applicant", "paytotal", "step", "type", "time", "canCopy", "canDele", "canEdit", "canPay", "showMenu", "proposalId", "tag", "canView", "planId", "applyId", "inAirSign", "inAirPay", "isShowBeneficiary"],
    created: function () {
    },
    methods: {
      onClick () {
        if (this.inAirPay || this.inAirSign) {
          this.toast('客户有可能正在操作中，请确认后，在投保进度中收回流程~')
        } else if (this.canEdit) {
          this.eventEdit()
        } else if (this.canView) {
          this.eventView()
        } else if (this.canPay) {
          this.eventPay()
        }
      },
      eventCopy () {
        // console.log(this.planId)
        // console.log(this.applyId)
        this.$emit('C_Copy', this.planId, this.applyId)
      },
      eventPay () {
        this.$emit("C_pay", this.planId, this.applyId)
      },
      eventDele () {
        this.$emit('C_Dele', this.planId, this.applyId)
      },
      eventEdit () {
        this.$emit('C_Edit', this.step, this.planId, this.applyId, this.isShowBeneficiary)
      },
      eventView () {
        this.$emit("C_View", this.planId, this.applyId)
      },
      eventDePay () {
        this.$emit('C_De_Pay', {...this.$props})
      },
      eventDeSign () {
        this.$emit('C_De_Sign', {...this.$props})
      },
      toast (msg) {
        this.$vux.toast.show({
          text: msg,
          type: 'text',
          width: '50%',
          isShowMask: true
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  @import '../../assets/styles/page.less';
  .arrow_icon:after{
    content: " ";
    display: inline-block;
    height: 10px;
    width: 10px;
    border-width: 1px 1px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    margin-top: -1px;
    right: 15px;
  }
  .progress-articlebox{
    background:#fff;
    margin-bottom:10px;
  .progressarticle {
    position: relative;
  &>.articlenav{
     min-height: 38px;
     line-height: 38px;
     vertical-align: middle;
     overflow: hidden;
     color: #a8a8a8;
     padding-left: 15px;
     position: relative;
     font-size:15px;
     font-size: 13px;
     color: #a8a8a8;
     display: flex;

  &>div{
     flex: 1;
     color: #a8a8a8;
     padding-top: 4px;
     padding-bottom: 4px;
     font-size: 0;
     padding-right: 10px;
  &>button{
     color:#666;
     border-radius: 5px;
     -webkit-appearance: none;
     border:none;
     font-size: 14px;
     display: inline-block;
     background: #fff;
     border:1px solid #c3c3c3;
     min-width:60px;
     height: 25px;
     padding-left: 8px;
     padding-right: 8px;
     margin: 2px 4px;
     float: right;
   }
  .eidt{
    border-color: #00a6ff;
    color: #00a6ff;
  }
  }
  }
  &>.articlebox{
     display: table;
     width:100%;
     height: 100px;
    border-bottom: 1px solid #efefef;
   /*@include borderbottom-1px(#efefef);*/
  &>div:first-child{
     width:130px;
   }
  &>div{
     display: table-cell;
     vertical-align:middle;

  &>img{
     display: block;
     width:100px;
     height:70px;
     margin-left: 15px;
   }
  &>span{
     display: block;
   }
  }
  &>div:nth-child(2)>span{
  &:first-child{
     width: 276/2px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
     font-size:15px;
     color:#333;
   }
  font-size:13px;
  color:#999;
  line-height: 20px;
  vertical-align: middle;
  }
  &>div:nth-child(3)>span{
     font-size:13px;
     color:#999;
     line-height: 20px;
     vertical-align: middle;
     text-align: right;
     padding-right: 30px;
  &.arrow_icon:after{

   }
  }
  }
  &>.articlebox2{
     display: table;
     width:100%;
     border-bottom: 1px solid #efefef;
   /*@include borderbottom-1px(#efefef);*/
  &>div{
     display: table-cell;
     vertical-align: middle;
     line-height: 60px;
     height: 60px;
  &:first-child{
     padding-left: 15px;
     color: #666;
     font-size: 15px;
   }
  &:last-child{
     font-size: 13px;
     text-align: left;
  &>span{
     color:#999;
     display: block;
     position: relative;
     line-height: 20px;
     padding-right: 30px;
     text-align: right;
  &.arrow_icon:after{

   }
  }
  }
  }
  }
  }
  }
</style>
