<template>
  <div id="transition">
    <div @click="test()">
      test
    </div>
    <div @click="sharepanelshow()">
      share
    </div>
    <share-panel v-model="showshare" :sum="sum" @share="share"></share-panel>

  </div>
</template>

<script>
  import { INITAPPLICANTANDINSURANTINFORM, SAVESINGLEINSURANTIMPART } from '@/api'
  import notifyFixed from '../notify-fixed/notify-fixed.vue'
  import sharePanel from './sharepanel.vue'
  export default {
    name: 'notify-ins2',
    data() {
      return {
        impartType:-1,
        insureSeq:-1,
        showshare:false,
        sum:5
      }
    },
    created() {
    },
    methods: {
      test(){
        this.$router.push({name:'notify-grade',query:{
          impartType:'02',
          insureSeq:1,
          planId:this.$route.query.planId || '',
          applyId:this.$route.query.applyId || ''
        }})
      },
      sharepanelshow(){
        this.showshare = true;
      },
      share(nowVal,sumVal){
        console.log('sharedata',nowVal,sumVal)
      }
    },
    components: {
      sharePanel
    }
  }
</script>
<style lang='less'>
  @import "../../../../assets/styles/notify/notify.less";
  #transition{

  }

</style>
