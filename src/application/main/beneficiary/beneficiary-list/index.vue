<template>
  <div class="container benificiary">
    <cust-item
    v-for="(item,index) in multiInsurants"
    :key="index"
    :custinfo="item"
    :propindex="index + 1"
    @onChange="onChange"
    @update="update"
    :applyId="applyId"
    :planId="planId"
    ></cust-item>
    <div class="btn-next" @click="nextStep">下一步</div>
  </div>
</template>

<script>

  import Vue from 'vue'
  import {BENEFICIARTYLIST, QUERYINSURANT, CHECKBENEFICTATY} from '@/api'
  import custItem from './cust-item'

  import {mapActions} from 'vuex'
  import store, {ACTION} from 'src/store'

  export default {
    name: 'beneficiary',
    data() {
      return {
        applyId: '',
        multiInsurants: [],
        custCollection: {},
         relation:[
           {
              name: '本人',
              value: '00'
            },
            {
              name: '父母',
              value: '01'
            },
            {
              name: '配偶',
              value: '02'
            },
            {
              name: '子女',
              value: '03'
            },
            {
              name: '祖孙',
              value: '04'
            },
            {
              name: '监护',
              value: '05'
            },
            {
              name: '其他',
              value: '06'
            },
            {
              name: '保单服务人员',
              value: '07'
            },
            {
              name: '直系亲属',
              value: '08'
            }
      ],
      }
    },
    created() {
      // debugger
      this.applyId = this.$route.query.applyId;
      this.planId = this.$route.query.planId;

      window.test = this
      if(this.applyId) {
        this.getBeneficiary();
      }
    },
    methods: {
      // 初始化受益人列表
      getBeneficiary() {
        this.axios.post(QUERYINSURANT, {'applyId': this.applyId})
        .then(({data})=>{
          if (data.success){
            data.value.forEach(item =>{
                if (item.benefictaryDTO && item.benefictaryDTO.benefictaryCustomerDTOList) {
                    item.benefictaryDTO.benefictaryCustomerDTOList.forEach(item1 => {
                      this.relation.forEach(item2 =>{
                        if(item2.value === item1.relation){
                          item1.relation = item2.name
                        }
                      })
                    })
                }
              })
            this.multiInsurants = data.value
          } else {
            this.$vux.toast.show({
              text: data.errorMsg
            })
          }
        })
        .catch((err) =>{
          console.log(err);
        })
      },
      onChange(v){
        console.log(v)
        this.custCollection[v.insureSeq] = v.isValid
      },
      // 实时更新数据
      update(){
        this.getBeneficiary();
      },
      nextStep() {
        // 校验是否缺少受益人信息
        let isValid = Object.values(this.multiInsurants).find(i => {
          return i.benefictaryDTO && i.benefictaryDTO.benefictaryCustomerDTOList==null && i.benefictaryDTO.benefictaryType==2
        })
        // let isValid = Object.values(this.custCollection).find(i=>!i)
        if(isValid!==undefined) {
          return this.$vux.toast.show({
                    text: '缺少指定受益人信息',
                    type: 'text',
                    width: '50%',
                    isShowMask: true
                  })
         }
        this.axios.post(CHECKBENEFICTATY, {applyId: this.applyId})
        .then(({data}) => {
          if (data.success){
            const route = this.$route
            const {planId} = route.query
            store.dispatch(ACTION.GET_ROUTE_NEXT, {planId, route}).then(nextRoute => {
              this.$router.push({...nextRoute, query: route.query})
            })
            // this.$router.push({path: '/notify/applicant', query:{applyId: this.applyId}})
          } else {
            this.$vux.toast.show({
              text: data.errorMsg
            })
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },
    components: {
      custItem
    }
  }
</script>

<style lang='less' scoped>
   @import "../../../../assets/styles/page.less";
   @import "../../../../assets/styles/form.less";
  .benificiary{
    background-color:@bgGray;
    padding-bottom: 45px;
    .next {
      margin-top: 20px;
      width: 350px;
      height: 46px;
    }

    /deep/
    .weui-navbar {
      z-index: 10;
    }
  }
</style>

