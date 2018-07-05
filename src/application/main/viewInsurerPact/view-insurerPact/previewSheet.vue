<template>
  <div id="previewSheet">
    <div class="form-title" index="0"><div class="msg">
      被保险人
    </div></div>
    <div class="info-item"   v-for="(infolist,index) in currentInsurerInfo" :key="index">

      <div class="content">
        <div class="left">
          <span>{{infolist.name}}</span>
        </div>
        <div class="right">
          <!--<span>{{infolist.value}}</span>-->
          <span>{{infolist | formatcell}}</span>
        </div>
      </div>
    </div>


    <div class="form-title"><div class="msg">
      受益人
    </div></div>

    <div v-for="(item,beneIdx) in currentBene" :key="item.key">
      <div class="info-item">
        <div class="content beneficiaryinfo">
          <div class="left">
            <span>{{item.key}}</span>
          </div>
          <div class="right">
            <span></span>
          </div>
        </div>
      </div>

      <div class="info-item" v-for="(cell,cellIdx) in item.itemList" :key="cellIdx">
        <div class="content ">
          <div class="left">
            <span>{{cell.name}}</span>
          </div>
          <div class="right">
            <span>{{cell.value}}</span>
          </div>
        </div>
      </div>
    </div>



    <div class="form-title" index="0"><div class="msg">
      投保事项
    </div></div>
    <div class="insure-terms">


      <div class="title">
        <div>产品名称</div>
        <div>保障金额</div>
        <div class="fare">
          <div>交费期/</div>
          <div>保障期</div>
        </div>
        <!--<div class="cell">缴费年期</div>-->
        <div>首年保费</div>
      </div>
      <div class="content" v-for="(prod,index) in currentProdInfo" :key="index">
        <!--<div class="productname">{{prod.abbrName}}</div>-->

        <div class="fare">
          <div class="cell">{{prod.abbrName}}</div>
          <div class="cell">{{prod.amount_value}}</div>
          <div class="cell pay">
            <div>{{prod.insure}}/</div>
            <div>{{prod.pay}}</div>
          </div>
          <div class="cell">{{prod.premium}}</div>
        </div>
      </div>

      <div class="gross">
        <div class="left"></div>
        <div class="right">期缴保费合计:
           <span>
             {{currentPaySum}}
           </span>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
  export default {
    props: {
      info: {
        type: Array,
        required: true,
        default:[]
      },
      currentTab:{
        type:Number,
        default:0
      }
    },
    created() {
//      this.currentInsurerInfo = this.info[this.currentTab].insured;
    },
    data: function() {
      return {
        tabIdx:0,
        currentInsurerInfo:null,
        currentProdInfo:null,
        currentBene:null,
        currentPaySum:''
      };
    },
    methods: {

    },
    filters: {
      formatcell: (val)=>{
        console.log(val);
        if(val.name == '职业'){
          let jobData = window.__occupationData
          if(val.value && jobData[val.value]){
            return jobData[val.value]
          }
        }
//        else if(val.name == '身高' || val.name == '体重'){
//          return parseInt(val.value);
//        }
        return val.value;
      }
    },
    watch: {
      currentTab(val){
        this.tabIdx = val;
        this.currentInsurerInfo = this.info[val].insured;
        this.currentBene = this.info[val].benefitModel.benefitList;
        this.currentProdInfo = this.info[val].productList;
        this.currentPaySum = this.info[val].payInfo[0].value;
        console.log('currentBene',this.currentBene)
      }
    }
  };
</script>

<style <style lang="less" scoped>
#previewSheet{
  .form-title {
    background-color: #f7f7f7;
    overflow: hidden;
    height: 3rem;
    line-height: 3rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 1.07143rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size:16px;
    color:#666;
    .msg:before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 18px;
      padding-left: 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-left: 3px solid #154cbb;
      vertical-align: middle;
      margin-top: -2px;
    }
  }
  .info-item{
    background-color: #fff;
    .beneficiaryinfo{
      color:#5699ff;
    }
    .content{
      padding: 10px 0;
      margin-left: 20px;
      border-bottom:1px solid #e1e1e1;
      /**/
      display: flex;
      .left{
        flex:1;
        display: flex;
        align-items: center;

      }
      .right{
        flex:1;
        display: flex;
        align-items: center;
        justify-content:flex-end;
        padding-right: 10px;
      }
    }
  }

  .insure-terms {
    background-color: #fff;
    padding: 10px;
    margin-bottom:20px;
    .title{
      display: flex;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      background-color:#d4e6ff;
      color:#67737e;
      div{
        flex:1;
        display: flex;
        justify-content:center;
        align-items:center;
      }
      & > .fare{
          flex-direction: column;
        }
    }
    .content {
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      flex-direction: column;
      background-color:#f0eff5;
      .productname{
        padding: 10px 0;
      }

      .fare{
        /*padding-bottom: 10px;*/
        display: flex;
        .cell{
          flex:1;
          padding: 10px 0;
          display: flex;
          align-items:center;
          justify-content:center;
        }
        .pay{
          flex-direction: column;
        }
      }
    }
    .gross{
      height: 40px;
      line-height: 40px;
      display: flex;
      background-color:#f0eff5;
      border-bottom-left-radius:5px;
      border-bottom-right-radius:5px;
      .left{
        flex:1;
        padding-left: 20px;
      }
      .right{
        flex:2;
        text-align: right;
        padding-right: 20px;
        span{
          color:#fa836e;
        }
      }
    }
  }

}

</style>
