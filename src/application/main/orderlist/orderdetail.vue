<template>
  <div class="container">

    <header>
      <div class="banner">
        <img src="" alt="">
      </div>
    </header>

    <article>
      <section id="orderdetail">

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

        <form-unit name="applicant" :formModels="applicantModel">
        </form-unit>

        <!--<div class="occupy"></div>-->

        <div style="margin-top: 20px">
          <tabs
            :insurantList="inslist"
            :selected="0"
            label="label"
            @onSelect="onSelect">
          </tabs>
        </div>


        <previewsheet :info="info" :currentTab="currentTab"></previewsheet>

        <!--<div class="signature" @click="signature">电子签名</div>-->

      </section>
    </article>

    <footer></footer>

  </div>
</template>

<script>
  // 导入自定义组件
  import { formUnit, zaInput, zaSelect } from "vformer";
  import tabs from "../../../components/tab/tabs2";
  import previewsheet from "./previewSheet";
  import {appModel} from "./orderdetailmodule";
  import {ISEARCHDETAIL} from "@/api";

  let IMGROOT = 'http://fosun-test.zaouter.com';

  export default {
    data(){
      return {
        formModel: appModel,
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
      signature(){
        this.$router.push({name:'sign-esignature',query:this.$route.query})
      },
      onSelect(v) {
        this.currentTab = v;
      },
      getData() {
        console.log(this.$route.query)
        this.axios
          .post(ISEARCHDETAIL, {contNo:this.$route.query.contNo})
//          .post(VIEWINSURERPACT, {applyId:44})
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
      tabs,
      formUnit,
      zaInput,
      zaSelect,
      previewsheet
    },
    created() {
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../assets/styles/page.less';
  #orderdetail{
    background-color:#f7f7f7;
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




  }

</style>
