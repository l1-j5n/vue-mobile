<template>
  <div class="container">

    <header>
      <div class="banner">
        <img src="" alt="">
      </div>
    </header>

    <article>
      <section id="progressdetail">

        <div id="businesscard">
          <div class="title">
            销售信息
          </div>
          <div class="businessId">
            <div class="left">
              电子投保单号:
            </div>
            <div class="right">
              {{applyNo}}
            </div>
          </div>
          <div class="brief">
            <div class="left">
              <img class="headerphoto" :src="agent.iconUrl" alt="">
            </div>
            <div class="right">
              <div>{{agent.agentName}}</div>
              <div class="workId">
                <span>工号：</span>
                <span>{{agent.agentCode}}</span>
              </div>
            </div>
          </div>
        </div>

        <div id="applicant">
            <div class="title">投保人信息</div>
            <div class="applicantInfo">
              <div class="item" v-for="(item, index) in applicant" >
                <div class="left">{{item.name}}</div>
                <div class="right">{{item.value}}</div>
              </div>
            </div>
        </div>

        <div id="recognizeeFrame">
          <div class="member">
            <div class="title" :class = "folderFlag?'unfold':'fold'" @click="actfold">第1被保险人</div>
            <!-- 被保人 -->
            <div class="recognizee">
              <div class="recognizee-title">被保人</div>
              <div class="recognizee-info">
                <div class="recognizee-item">
                  <div class="left">是投保人</div>
                  <div class="right"> 本人</div>
                </div>
                <div class="recognizee-item">
                  <div class="left">是投保人</div>
                  <div class="right"> 本人</div>
                </div>
              </div>
            </div>
            <!-- 受益人 -->
            <div class="beneficiary">
              <div class="beneficiary-title">受益人</div>
              <div class="beneficiary-info">
                <div class="beneficiary-item">
                  <div class="left">身故保险收益人1</div>
                  <div class="right"></div>
                </div>
                <div class="beneficiary-item">
                  <div class="left">身故受益人姓名</div>
                  <div class="right">王子奇</div>
                </div>
                <div class="beneficiary-item">
                  <div class="left">性别</div>
                  <div class="right">男</div>
                </div>
              </div>
            </div>
            <!-- 产品 -->
            <div class="product">
              <div class="product-title"></div>
              <div class="product-title"></div>
              <div class="product-item"></div>
              <div class="product-fare"></div>
            </div>
          </div>
        </div>

        <!--<form-unit name="applicant" :formModels="applicantModel">-->
        <!--</form-unit>-->




        <!--<previewsheet :info="info" :currentTab="currentTab"></previewsheet>-->

        <!--<div class="signature" @click="signature">电子签名</div>-->

      </section>
    </article>

    <footer></footer>

  </div>
</template>

<script>
  // 导入自定义组件
  import { formUnit, zaInput, zaSelect } from "vformer";
//  import tabs from "../../../../components/tab/tabs2";
//  import previewsheet from "./previewSheet";
//  import {appModel} from "./formModel";
  import {ISEARCHDETAIL} from "@/api";

  let IMGROOT = 'http://fosun-test.zaouter.com';

  export default {
    data(){
      return {
        folderFlag:false,

//        formModel: appModel,
        inslist:[],
        agent:{},
        applyNo:'',
        applicant:null,
        applicantModel:null,
        applicantinfoTpl: {
          value: '',
          rules: {
            label: '',
            type: 'za-input',
            readOnly:true
          }
        },
        info:[],
        currentTab:-1

      }
    },
    methods: {
      actfold(){
        this.folderFlag = !this.folderFlag;
      },


      signature(){
        this.$router.push({name:'sign-esignature',query:this.$route.query})
      },
      onSelect(v) {
        this.currentTab = v;
      },
      getData() {
        console.log(this.$route.query)
        this.axios
          .post(VIEWINSURERPACT, {applyId:this.$route.query.applyId})
          .then(({ data }) => {
            if (data.success) {
              this.applyNo = data.value.applyNo;
              this.agent = data.value.agent; //代理人
              this.applicant = data.value.applicant;  //投保人
              this.getConfiginfo(this.applicant);
              this.info = data.value.insurants;
              this.currentTab = 0;
//              this.agent.iconUrl = IMGROOT + this.agent.iconUrl;
              this.agent.iconUrl = this.agent.iconUrl;

              this.info.forEach((item,idx)=>{
                if(item.insured && item.insured.length>0){
                  this.inslist.push({
                    label: item.insured[0].value,
                    name:idx+''
                  })
                }
              })

            }
          });
      },
      getConfiginfo(applicant) {

        //投保人格式化
        applicant.forEach((item,idx)=>{
          let model = this.deepClone(this.applicantinfoTpl);
          model.rules.label = item.name;
          model.value = item.value;
          appModel['applicant'+idx]=model;
        })
        this.applicantModel = appModel;

      },
      deepClone(obj) {
        var str,
          newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== "object") {
          return;
        } else if (window.JSON) {
          (str = JSON.stringify(obj)), //系列化对象
            (newobj = JSON.parse(str)); //还原
        } else {
          for (var i in obj) {
            newobj[i] = typeof obj[i] === "object" ? cloneObj(obj[i]) : obj[i];
          }
        }
        return newobj;
      },
    },
    components: {
//      tabs,
      formUnit,
      zaInput,
      zaSelect
//      previewsheet
    },
    created() {
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../assets/styles/page.less';
  #progressdetail{
    background-color:#EFEFF4;
  #businesscard{
    margin: 0 auto;
    width:90%;
    background-color:#fff;
    /*border:1px solid #bbb;*/
    margin-bottom:20px;
    border-radius: 5px;


  .title{
    border-top-left-radius:5px;
    border-top-right-radius:5px;
    background-color: #d4e6ff;
    height: 30px;
    line-height: 30px;
    color:#000;
    font-weight: bold;
    text-align: center;
  }
  .businessId{
    height: 40px;
    line-height: 40px;
    color: #5798fd;
    display:flex;
    margin: 0 10px;
    /*border-top:1px solid #bbb;*/
    border-bottom:1px solid #e1e1e1;
  .left{
    text-align: right;
    flex:1;
    margin-right: 20px;
  }
  .right{
    flex:1;

  }
  }
  .brief{
    height: 80px;
    display:flex;
  .left{
    flex:1;
    display:flex;
    justify-content:center;
    align-items:center;
  .headerphoto{
    margin-left: 40px;
    display: inline-block;
    width: 60px;
    height: 60px;
    background-color: #bbbbbb;
    border-radius: 50%;

  }
  }
  .right{
    flex:1;
  div{
    height: 50%;
    display:flex;
    align-items:center;
  }
  .workId{
    color:#999999;
  }
  }
  }
  }

  .occupy{
    height: 20px;
  }

  .signature{
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: linear-gradient(to right, #66a5ff , #0062e9); /* 标准的语法 */
    color:#fff;
    font-size: 16px;
  }



  #applicant{

    height:100%;
    .title{
      height:46px;
      line-height: 46px;
      padding-left: 10px;
      color:#686868;
      font-size: 16px;
    }
    .title::before{
      content: "";
      display: inline-block;
      width: 3px;
      height: 16px;
      padding-left: 5px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-left: 3px solid #006eee;
      vertical-align: middle;
      margin-top: -2px;

    }
    .applicantInfo{
      /*margin-bottom: 20px;*/
      /*height:44px;*/

      .item{
        background-color:#fff;
        padding: 10px 10px;
        display:flex;
        position:relative;
        .left{
          flex:1;
        }
        .right{
          flex:1;
          text-align: right;
        }
      }
      .item::before{
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e1e1e1;
        color: red;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        left: 10px;
      }
    }
  }

  #recognizeeFrame{
    background-color:#fff;
    margin-top:10px;
    .member{
      position:relative;
      .title{
        height:46px;
        line-height: 46px;
        padding-left: 10px;
        color:#686868;
        font-size: 14px;
        border-bottom: 1px solid #e1e1e1;
      }
      .title::before{
        content: "";
        display: inline-block;
        width: 3px;
        height: 14px;
        padding-left: 5px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border-left: 3px solid #006eee;
        vertical-align: middle;
        margin-top: -2px;

      }
      .title.fold::after{
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-color: blue;
        right: 10px;
        top:10px;
        position: absolute;
        background:url('~@/assets/styles/images/progressdetail/fold.png') no-repeat;
        background-size:100% 100%;
      }
      .title.unfold::after{
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-color: blue;
        right: 10px;
        top:10px;
        position: absolute;
        background:url('~@/assets/styles/images/progressdetail/unfold.png') no-repeat;
        background-size:100% 100%;
      }

      .recognizee{
        .recognizee-title{
          height:46px;
          line-height: 46px;
          padding-left: 10px;
          color:#686868;
          font-size: 14px;
        }
        .recognizee-info{
          .recognizee-item{
            display:flex;
            position: relative;
            background-color: #f7f7f7;
            padding: 10px 5px;
            margin: 0px 10px;

            .left{
              flex:1;
            }
            .right{
              flex:1;
              text-align: right;
            }
          }
          .recognizee-item::after{
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 1px;
            border-bottom: 1px solid #e1e1e1;
            color: red;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            margin: 0 10px;
          }
        }

      }

      .beneficiary{
        .beneficiary-title{
          height:46px;
          line-height: 46px;
          padding-left: 10px;
          color:#686868;
          font-size: 14px;
        }
      }

    }
  }

  }

</style>
