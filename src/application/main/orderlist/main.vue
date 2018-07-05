<template>
  <div id="orderlist">
    <!-- <div @click="getData">adsfasdfasdfasdf</div> -->

    <div>
      <tab :animate="false" :line-width="2" active-color="#14a3ff" defaultColor="#666">
        <tab-item v-for="(item,index) in tab" :key="item.id" :selected="tabId == index ? true : false" active-class="active" @on-item-click="handler(index, item.id)">
          {{item.name}}
        </tab-item>
      </tab>
    </div>



    <ul class="proResultBox" v-if="show">
      <li v-for="(item, index) in items" :key="item.id">
        <searchdetail
          :id="item.id"
          @C_Click = "viewDetail(item.contNo)" class="insureElement">
          <!-- <dl :class="[item.status ? 'succ' : 'fail']"> -->
          <dl :class="{'pending': item.state=='1','succ': item.state=='2','fail': item.state=='3','period':item.state=='4'}">
            <dt>
            <div class="prodtitle">
              {{item.mainRiskName}}
            </div>
            <div>{{item.contNo}}</div>
            </dt>
            <dd >
              <div>投保人</div>
              <div>{{item.appntName}}</div>
            </dd>
            <dd >
              <div>被保人</div>
              <div>{{item.insuredName}}</div>
            </dd>
            <dd >
              <!-- <div>投保日期</div> -->
              <div>承保日期</div>
               <div>{{item.applyDate | dateformat}}</div>
              <!--<div>{{item.underWritingDate}}</div>-->
            </dd>
            <dd >
              <div>期交保费</div>
              <div>{{item.prem}} 元</div>
            </dd>
          </dl>
        </searchdetail>
      </li>
    </ul>
    <c_errMsg txt = "啊哦 ～～,抱歉当前无记录信息哦!" v-else></c_errMsg>
  </div>
</template>
<script>
  import Vue from 'vue'
  import searchdetail from './detailitem'
  import {IPROGRESQUERY, ISEARCHLIST} from '@/api'
  import { Tab, TabItem } from 'vformer'
  import dateformat from '@/utils/dateFormat'
  export default {
    data: () => {
      return {

        tabId:0,
        tab:[
          {name:'全部',id:0},
          {name:'待生效',id:1},
          {name:'已生效',id:2},
          {name:'失效',id:3},
          {name:'终止',id:4}
        ],
        show: true,
        items: []
        // items: [{
        //   "name": "aaa",
        //   "id": "123",
        //   "imgpath": "https://static",
        //   "title": "健康综合计划",
        //   "applicant": "张三",
        //   "paytotal": "230元",
        //   "step": "利益演示",
        //   "type": "1",
        //   "time": "2017/01/01 15:00:00",
        //   "copy": "true",
        //   "showMenu": "hidden",
        //   "status": true
        // },
        // {
        //   "name": "aaa",
        //   "id": "123",
        //   "imgpath": "https://static.zhongan.com/upload/mobile/material/1490759500160.png",
        //   "title": "健康综合计划",
        //   "applicant": "张三",
        //   "paytotal": "230元",
        //   "step": "利益演示",
        //   "type": "1",
        //   "time": "2017/01/01 15:00:00",
        //   "copy": "true",
        //   "showMenu": "hidden",
        //   "status": false
        // },
        // {
        //   "name": "aaa",
        //   "id": "123",
        //   "imgpath": "https://static.zhongan.com/upload/mobile/material/1490759500160.png",
        //   "title": "健康综合计划",
        //   "applicant": "张三",
        //   "paytotal": "230元",
        //   "step": "利益演示",
        //   "type": "1",
        //   "time": "2017/01/01 15:00:00",
        //   "copy": "true",
        //   "showMenu": "hidden",
        //   "status": false
        // }
        // ]
      }
    },
    name: 'search',
    created: function () {
      if(typeof(this.$route.query.appFlag) != 'undefined' && this.$route.query.appFlag != ''){
        this.tabId = this.$route.query.appFlag;
      }

      window.gotoqueryorder = function () {
        this.$router.push({path: '/queryorder'});
      }

      this.getData(false)
    },
    computed: {
    },
    methods: {
      handler(index,tabId){
        this.tabId = tabId;
        this.getData();
      },
      getData (append = true) {
        // var param = {
        //   "name": "SKK",
        //   "sex": "0",
        //   "birthday": "1990-09-06",
        //   "idType": "0",
        //   "idNo": "411325199009062913",
        //   "agentCode": "1330000004"
        // }
        let param = {
          name: this.$route.query.name || '',
          idNo: this.$route.query.idNo || '',
          contNo:this.$route.query.contNo || '',
          polApplyStartDate: this.$route.query.polApplyStartDate || '',
          polApplyEndDate: this.$route.query.polApplyEndDate || '',
          appFlag:this.tabId,
        }
//        let {appFlag, contNo, polApplyStartDate, polApplyEndDate} = this.$route.query
//        param = {...param, ...{appFlag, contNo, polApplyStartDate, polApplyEndDate}}
        this.pageNum = append ? Number(this.pageNum) + 1 : 1
        this.axios.post(ISEARCHLIST, param).then(response => {
          if (response.data.success) {
            this.items = response.data.value
          } else {
            this.$vux.toast.show({
              text: response.data.errorMsg,
              type: 'text',
              width: '50%',
              isShowMask: true
            })
          }
        }, fail => {
        }).catch((err) => {
          console.log(err)
          throw new Error(err)
        })
      },
      viewDetail (n) {
        this.$router.push({path: "/orderdetail", query: {contNo: n}})
      }
    },
    filters: {
      dateformat: (val)=>{
        return dateformat(new Date(val),'yyyy-MM-dd');
      }
    },
    components: {
      searchdetail,
      Tab,
      TabItem
    }
  }
</script>
<style lang='less' scoped>
  @import '../../../assets/styles/page.less';
  #orderlist{
    background: #f7f7f7;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  // min-height: 100%;
  // padding: 1px 0;

  .prodtitle{
    padding-right: 20px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    position: relative;
  }
  .prodtitle::after{
    content: " ";
    display: inline-block;
    height: 10px;
    width: 10px;
    border-width: 1px 1px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: absolute;
    right:10px;
    top: 8px;
  }


  &>.proResultBox{
  &>li{
     display: block;
   }
  }
  .insureElement{
    margin: 15px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 1px 1px 25px #ddd;
  & > dl{
      padding: 0 0 10px 0;
      position: relative;
  &.succ,&.fail,&.period{
  &:after{
     display: block;
     content: " ";
     display: block;
     width:80px;
     height: 80px;
     position: absolute;
     /*top:10%;*/
    bottom:16px;
     right:5%;
   }
  }
  &.succ{
  &:after{
     background: url("~@/assets/styles/images/ordersearch/insuresuccess.png") no-repeat;background-size:contain;
   }
  }
  &.fail{
  &:after{
     background: url("~@/assets/styles/images/ordersearch/insurefail.png") no-repeat;background-size:contain;
   }
  }
  &.period {
  &:after{
     background: url("~@/assets/styles/images/ordersearch/insureper.png") no-repeat;background-size:contain;
   }
  }
  &.pending {
  &:after{
     background: url("~@/assets/styles/images/ordersearch/pendingsuccess.png") no-repeat;background-size:contain;
   }
  }
  & > dt {
      padding: 10px 10px;
      margin-bottom: 10px;

      background-size: 100% 1px;
      background-position: bottom;
      background-repeat: no-repeat;
      background-image: url(~@/assets/styles/images/underscore.png);
    /*@include borderbottom-1px(#ddd);*/
      position: relative;
  & > div{
      /*height: 25px;*/
      /*line-height: 25px;*/
      vertical-align: middle;
    }
  & > div:first-child{
      font-size: 16px;
    }
  & > div:last-child{
      color:#666;
    }
  &:before,&:after{
              display: block;
              position: absolute;
              background: #efefef;
              content: " ";
              width: 10px;
              height: 10px;
              border-radius: 20px;
              bottom: -5px;
            }
  &:before{
     left: -5px;
   }
  &:after{
     right: -5px;
   }
  }
  & > dd {
      width: 100%;
      display:block;
  & > div{
      display: inline-block;
      height: 25px;
      line-height: 25px;
      vertical-align: middle;
      word-break:break-all;
      word-wrap: break-word;
      vertical-align: middle;
      overflow: hidden;
      color:#666;
    }
  & > div:first-child{
      text-indent: 10px;
      width:30%;
    }
  & > div:last-child{
      padding-right: 10px;
      text-align: left;
      padding-right: 10px;
    }
  }
  }
  }
  .insureElementTable{
    margin: 0 0 0 0;
    width: 100%;
    display: table;
  &>dt{
   }
  &>dd{
     display: table-row;
  & > div{
      display: table-cell;
      height: 35px;
      word-break:break-all;
      word-wrap: break-word;
      vertical-align: middle;
      overflow: hidden;


    /*@include borderbottom-1px(#efefef);*/
      background-size: 100% 1px;
      background-position: bottom;
      background-repeat: no-repeat;
      background-image: url(~@/assets/styles/images/underscore.png);
    }
  & > div:first-child{
      text-indent: 10px;
      width:30%;
    }
  & > div:last-child{
      width:70%;
      padding-right: 10px;
      text-align: right;
    }
  }
  }
  }
</style>
