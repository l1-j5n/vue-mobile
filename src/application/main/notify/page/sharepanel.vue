<!--
  复杂告知页面
  -- simon,2018.05.28
-->
<template>
  <div v-if="sharepanelshow" id="sharepanel">
    <div class="share-popup-dialog">
      <div>
        <i @click="hidesharePanel()" class="xmark"></i>
      </div>
      <div class="sum">
        <span class="left">{{sum}}</span>份可分享<span class="right" @click="allsel()">全选</span>
      </div>
      <div class="selectnum">
        <div class="left">选择份数</div>
        <div class="right">
          <div class="reduce" @click="reduce()">-</div>
          <div class="result">
            <input v-model="sharenum"></input>
          </div>
          <div class="add"  :class="{fade: sharenum==sum}" @click="add()">+</div>
        </div>
      </div>
      <div @click='share()' class="sharebtn">
        分享
      </div>
      <div class="illustration">
        分享后48小时内可激活，超时将退回哦~
      </div>

    </div>

    <div class="share-popup-mask" @click="hidesharePanel()" ></div>

  </div>
</template>

<script>

  export default {
    name: 'sharepanel',
    data() {
      return {
        sharenum:1,
        sharepanelshow:false,
        copy:false
      }
    },
    props: {
      sum:{
        type: Number,
        default: 1
      },
      value:{
        type:Boolean,
        default:false
      }
    },
    created() {

    },
    methods: {
      share(){
        this.$emit('share',this.sharenum,this.sum);
      },
      hidesharePanel(){
        this.sharepanelshow = false;
        this.$emit('input',false);
      },
      allsel(){
        this.sharenum = this.sum;
      },
      sharenumChange(){

      },
      reduce(){
        this.sharenum--;
      },
      add(){
        this.sharenum++;
      }
    },
    watch:{

      sharenum(curVal,oldVal){

        if(curVal<1){
          this.sharenum=1;
          this.$vux.toast.show({
            type: "text",
            width: '200px',
            text:'最少分享1份'
          })
        }
        else if(curVal>this.sum){
          this.sharenum=this.sum;
          this.$vux.toast.show({
            type: "text",
            width: '200px',
            text:'每次最多可分享'+this.sum+'份'
          })
        }
      },
      value(culVal,oldVal){
        this.sharepanelshow = culVal;
      }
    },
    components: {

    }
  }
</script>
<style lang='less'>
  #sharepanel{
    .share-popup-dialog{
      position: fixed;
      bottom:0;
      height:260px;
      background-color: #fff;
      z-index: 100;
      transition-duration:300ms;
      width: 100%;

    }

    .share-popup-mask{
      z-index:99;
      opacity:1;
      background:rgba(0, 0, 0, 0.5);
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .xmark{
      margin-top: 10px;
      margin-left:10px;
      display: inline-block;
      width: 20px;height:2px;
      background: #cfcfcf;
      line-height: 0;font-size:0;
      vertical-align: middle;
      -webkit-transform: rotate(45deg);
    }
    .xmark:after{
      content:'/';
      display:block;
      width: 20px;height:2px;
      background: #cfcfcf;
      -webkit-transform: rotate(-90deg);
    }

    .sum{
      margin-top: 10px;
      padding-right: 24px;
      text-align: right;
      color:#b8b8b8;
      .left{


      }
      .right{
        margin-left:4px;
        color:#43bbf3;
      }
    }

    .selectnum{
      display: flex;
      margin: 10px 0;
      .left{
        flex: 1;
        text-indent: 10px;
      }
      .right{
        flex:1;
        display: flex;
        justify-content: flex-end;
        padding-right:24px;
        div{
          width: 40px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 14px;

        }
        .add{
          border: 1px solid #cfcfcf;
          font-size: 20px;
        }
        .fade{
          color:#cfcfcf;
        }
        .result{
          border-top: 1px solid #cfcfcf;
          border-bottom: 1px solid #cfcfcf;
          input{
            width: 100%;
            text-align: center;
            border: none;
            outline:none;
          }

        }
        .reduce{
          border: 1px solid #cfcfcf;
          font-size: 20px;
        }

      }
    }

    .sharebtn{
      width: 90%;
      height: 54px;
      text-align: center;
      line-height: 54px;
      color:#fff;
      background-color: #00a8fe;
      margin: 20px auto;
    }

    .illustration{
      color:#acacac;
      text-align: center;
    }
  }
</style>
