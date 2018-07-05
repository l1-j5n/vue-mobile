<!--
      descript: 我的名片
-->
<template>
  <div class="cardBox">
    <div class="card">
      <div class="title">
        <img class="logo" src='~@/assets/styles/images/bussiness/logo.png'/>
      </div>
      <div class="content">
        <header>
          <div class="placeholder-photo photo">
            <img v-if="imgHeader != ''" :src="imgHeader" class="photo">
          </div>
          <div>
            <p class="name" id="name">{{name}}</p>
            <p class="job"><span>{{jobtitle}}</span><i class="jobtitle" v-if="jobtitle"></i><span id="job1">{{job}}</span></p>
          </div>
        </header>
        <div class="icon">
          <div class="infor phone" id="phone"><div class="border-top"><a :href="`tel: ${mobile}`">{{mobile}}</a></div></div>
          <!-- <div class="infor phone" id="mobile"><div><a :href="`tel: ${mobile}`">{{mobile}}</a></div></div> -->
          <div class="infor website"><div class="border-top">{{website}}</div></div>
          <div class="infor address" id="address"><div class="border-top">{{address}}</div></div>
          <div class="infor ico"><div class="border-top">代理人执业证号<p class="staffno">{{staffNo}}</p></div></div>
        </div>
        <div class="footer">
          <img class="qrcode" src='~@/assets/styles/images/bussiness/fuxingpublic.jpeg'/>
            <p class="qrcode-tilte">扫一扫<br>
            关注复星联合健康</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {IBUSSINESSCARD, IBUSINESSCARDSHARING} from '@/api'
  export default {
    name: 'name-card',
    props: {
      inApp: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        name: '',
        job: '',
        jobtitle: '',
        email: '',
        mobile: '',
        tel: '',
        website: '',
        address: '',
        shareimg: '',
        sharelink: '',
        sharetitle: '',
        sharedsc: '',
        uid: '',
        shareid: '',
        imgHeader: '',
        staffNo: ''
      }
    },
    mounted: function () {
      this.uid = this.$route.query.uid || ''
      this.shareid = this.$route.query.shareid
      this.getData()
      this.shareinit()
    },
    methods: {
      // 初始化分享功能
      shareinit () {
        if (this.shareid) { return }
        let params = {id: this.uid, shareid: this.shareid}
        if (!this.inApp) {
          Object.assign(params, {planTypeFlag: 'sharePlan', staffNo: this.$route.query.staffNo})
        }
        this.axios.post(IBUSINESSCARDSHARING, params).then((response) => {
          if (response.data.success) {
            this.shareimg = response.data.value.imgPath
            this.sharelink = response.data.value.linkUrl
            this.sharetitle = response.data.value.title
            this.sharedsc = response.data.value.content
            this.shareBtn()
          } else {
            this.$vux.toast.show({
              text: response.data.errorMsg,
              type: 'text',
              width: '50%',
              isShowMask: true
            })
          }
        }).catch(console.error)
      },
      // 显示分享菜单
      shareBtn () {
        window.showShareArr(null, this.sharelink, this.shareimg, this.sharetitle, this.sharedsc)
      },
      // 获取分享信息
      getData () {
        let params = {id: this.uid, shareid: this.shareid}
        if (!this.inApp) {
          Object.assign(params, {planTypeFlag: 'sharePlan', staffNo: this.$route.query.staffNo})
        }
        this.axios.post(IBUSSINESSCARD, params).then((response) => {
          if (response.data.success) {
            this.name = response.data.value.userName || ''
            this.job = response.data.value.companyName || ''
            this.jobtitle = response.data.value.grandName || ''
            this.mobile = response.data.value.mobile || ''
            this.tel = response.data.value.phone || ''
            this.staffNo = response.data.value.staffNo || ''
            this.email = response.data.value.email || ''
            this.address = response.data.value.companyAddress || ''
            this.website = response.data.value.webSite || ''
            this.imgHeader = response.data.value.imgHeader || ''
          } else {
            this.__toast(response.data.errorMsg)
          }
        }).catch(console.error)
      }
    }
  }
</script>

<style lang='less' scoped>
.cardBox{
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
}
.card{
  width: 90%;
  margin: 0 auto;
  border-radius: 10px 10px;
  overflow: hidden;
  box-shadow: 1px 1px 15px #cecece;
  -webkit-box-shadow: 1px 1px 15px #cecece;
  position: relative;
  top: 20px;
  .title{
    background:url('~@/assets/styles/images/bussiness/titlebg.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100%;
    height: 75px;
    .logo{
      width: 135px;
      height: 45px;
      display: inline-block;
      position: absolute;
      transform: translateX(-50%);
      top: 15px;
      left: 50%;
    }
  }
  .content{
    padding: 30px 0 20px;
    background: #fff;
    header{
      display: flex;
      padding: 0 20px 25px;
       border-bottom: 1px solid #eaeaea;
    }
    .name{
      color:#333;
      font-size: 18px;
      font-weight: 500;
    }
    .job{
      color:#b5b4b5;
      font-size: 15px;
      .jobtitle{
        margin: 0 6px;
        display: inline-block;
        width: 1px;
        height: 14px;
        background-color: #eaeaea;
        vertical-align: middle;
      }
    }
    .photo{
      display: inline-block;
      width: 85px;
      height: 85px;
      border-radius: 50%;
      margin-right: 16px;
    }
    .placeholder-photo {
      height: 85px;
      background: url('~@/assets/styles/images/placeholder/photo.png') scroll no-repeat center center;
      background-size: contain;
    }
    .footer{
      display: flex;
      padding: 20px 20px 0;
      border-top: 1px solid #eaeaea;
       .qrcode{
          width: 85px;
          height: 85px;
          display: inline-block;
          margin-right: 16px;
        }
        .qrcode-tilte{
          color:#b5b4b5;
          font-size: 14px;
          padding-top: 25px;
          padding-bottom: 25px;
        }
      }
    .icon{
      padding-left: 36px;
      position: relative;
    .infor{
      color:#32374f;
      font-size: 15px;
      word-break: break-all;
      display: flex;
      line-height: 45px;
        .border-top{
          border-top: 1px solid #eaeaea;
          padding: 15px 20px 15px 0;
           a, a:hover, a:visited, a:focus , a:active{
            color: #32374f;
          }
          .staffno{
            color: #b5b4b5;
          }
        }
        &.phone{
          .border-top{
            border-top: none;
          }
        }
      }
    .infor{
      div{
        flex: 1;
        line-height: 18px;
      }
    }
    &>.email:before,
    &>.phone:before,
    &>.tel:before,
    &>.website:before,
    &>.ico::before,
    &>.address:before{
      // background: url('~@/assets/styles/images/bussiness/address.png') no-repeat;
      content: " ";
      width: 20px;
      height: 20px;
      display: inline-block;
      background-size: 100%;
      position: relative;
      top: 15px;
      font-size:15px;
      left: -10px;
    }
    &>.email:before{background: url('~@/assets/styles/images/bussiness/mail.png') no-repeat; background-size: contain;}
    &>.phone:before{background: url('~@/assets/styles/images/bussiness/icon_phone.png') no-repeat; background-size: contain;}
    &>.tel:before{background: url('~@/assets/styles/images/bussiness/tel.png') no-repeat; background-size: contain;}
    &>.website:before{background: url('~@/assets/styles/images/bussiness/website.png') no-repeat; background-size: contain;}
    &>.address:before{background: url('~@/assets/styles/images/bussiness/address.png') no-repeat; background-size: contain;}
     &>.ico:before{background: url('~@/assets/styles/images/bussiness/icon_lce.png') no-repeat; background-size: contain;}
    }
  }
}
</style>
