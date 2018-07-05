/*
* @Author: jankergg
* @Date:   2018-06-25 15:44:42
* @Last Modified by:   jankergg
* @Last Modified time: 2018-07-03 17:58:30
*/
import { formUnit, zaInput, zaSelect, zaTitle } from "vformer";
// 导入formUnit
import zaOccupation from "@/components/occupation"
import { LOADPROPOSAL, CURRENTTIME, CREATMOREINSUREPROPOSAL, GETCUSTM, DELETEINSURER } from "@/api";
import { appModel, otherInsModel, firstInsModel } from "./formModel";
export default {
  data() {
    return {
      applicantData: appModel,
      //结构{0:{},1:{}}
      insList: {'0':this.__deepCopy(firstInsModel)},
      //数据结构 {'applicant':'','ins0':{},'ins1':{},...}
      formCollection: {},
      currenttime: '',
      selselfFlag:true,
      applicantob:null,
      barrierOper:false
    };
  },
  watch: {
    applicantob: {//深度监听，可监听到对象、数组的变化
      handler(newVal, oldVal){
        let applicantFill = true;
        Object.keys(newVal).map((key,idx)=>{
          if(!newVal[key]){
            applicantFill = false;
          }
        });
        if(!applicantFill){
          this.barrierOper = true;
          this.$nextTick(()=>{
            this.$refs.barrier.style.top = this.getForm('applicanttitle').$el.clientHeight+this.getForm('applicant').$el.clientHeight+'px';
          })
        }
        else{
          this.barrierOper = false;
        }
      },
      deep:true
    }
  },
  methods: {
    //  ---------------------------------------------初始化操作---------------------------------------------------------------
    formUnitInit(v) {
      this.formCollection[v.name] = v;
    },
    barrierOperTip(){
      this.$vux.toast.show({ text: '请填写完整投保人信息' });
    },
    getCurrentTime(){
      this.getCustViaId().then(res => {
        this.axios.post(CURRENTTIME).then(({ data }) => {
          this.currenttime = this.processTime(parseInt(data.systemTime));
          this.initTime(this.currenttime);
          this.getData();
        });
      })
    },
    getCustViaId(){
      const { custId } = this.$route.query
      if (!custId){
        return Promise.resolve(false)
      }
      return this.axios.post(GETCUSTM, {id: custId}).then(({data}) => {
        if (data.success){
          let _self = this.__clone(appModel)
          // 设置投保人
          if (data.value.birthday){
            data.value.birthday = this.processTime(parseInt(data.value.birthday))
          }
          Object.keys(data.value).map(item => {
            Object.keys(_self).map(item2 => {
              let val = data.value[item]
              if (item === item2 && val !== null) {
                _self[item2].value = val;
              }
            });
          });
          this.applicantData = _self
        }
        return data.success
      })
    },
    getData() {
      const { planId = '' } = this.$route.query
      this.axios.post(LOADPROPOSAL, { planId }).then(({ data }) => {
        if (data.success) {
          this.setData(data.value.content);
        }else if(this.$route.query&&this.$route.query.planId){
          this.$vux.toast.show({ text: data.errorMsg });
        }

          this.applicantob = this.formCollection.applicant.formValues
        // console.log(this.getForm('applicanttitle').$el.clientHeight)
      });
    },
    //  ---------------------------------------------被保人增删---------------------------------------------------------------
    deleteInsurant(key){
      if(this.insList[key].insureId.value){
        let form={
          planId:this.$route.query.planId,
          insureId:this.insList[key].insureId.value
        }
        this.axios.post(DELETEINSURER, form).then(({ data }) => {
          if (data.success) {
            this.$delete(this.formCollection, 'ins'+key)
            this.$delete(this.insList, key)
            Object.keys(this.insList).map((key,index) => {
              let obj = this.insList[key];
              let form = this.formCollection['ins'+key].formValues;
              Object.keys(obj).map((key)=>{
                obj[key].value = form[key];
              })
            });
          }
          else{
            this.$vux.toast.show({ text: data.errorMsg });
          }
        });
      }
      else{
        // console.log('before',this.formCollection);
        // console.log(this.insList)
        this.$delete(this.formCollection, 'ins'+key)
        this.$delete(this.insList, key)

        //删除后让所填信息保留
        Object.keys(this.insList).map((key,index) => {
            let obj = this.insList[key];
            let form = this.formCollection['ins'+key].formValues;
            Object.keys(obj).map((key)=>{
              obj[key].value = form[key];
            })
        });

        // console.log('after',this.formCollection);
        // console.log(this.insList)
      }
    },
    addIns() {
      this.validateAll().then(res => {
        if (res === true) {
          let lenArr = Object.keys(this.insList);
          const newInsModel = this.__deepCopy(otherInsModel)
          let length = 0;
          lenArr.map((item,key) => {
            if(this.insList[item]){
              length = length + 1
            }
          })
          if (length >= 6) {
            this.$vux.toast.show({ text: '被保险人上限6个' });
            return;
          }
          // this.$set(this.insList, lenArr.length, newInsModel);
          let idx = parseInt(lenArr[length-1])+1;
          idx=idx+'';
          this.$set(this.insList, idx, newInsModel);

          console.log(this.insList);
        }
        else{
          this.$vux.toast.show({ text: '请填写完整信息后再添加被保人' });
          return;
        }
      });

    },
    //  ---------------------------------------------数据处理，绑定---------------------------------------------------------------
    setData(data) {
      let applicantLen = data.applicant&&Object.keys(data.applicant).length;
      let _self = appModel;
      // 设置投保人
      if (applicantLen) {
        Object.keys(data.applicant).map(item => {
          Object.keys(_self).map(item2 => {
            if (item == item2) {
              _self[item2].value = data.applicant[item];
            }
          });
        });
      }
      this.applicantData = _self
      //设置被保人
      let insurantArr = data.planList&&data.planList[0]&&data.planList[0]['insurants'] || []
      let resultInsurantArr = {}
      insurantArr.map((item, key) => {
        // copy被保人数据模型
        let copyInsrant = this.__deepCopy(otherInsModel)
        if(key === 0){
          copyInsrant = this.__deepCopy(firstInsModel)
        }
        // 迭代模型里的每个项的值
        Object.keys(copyInsrant).map((sItem, sKey) => {
          copyInsrant[sItem].value = item[sItem]
          // 如果是本人那么设置为只读
          if(item['relation'] === '00' && sItem!=='relation'){
            copyInsrant[sItem].rules['readOnly'] = true
          }
        })
        resultInsurantArr[key] = copyInsrant
      })
      if (JSON.stringify(resultInsurantArr) !== '{}'){
        this.insList = resultInsurantArr
      }
    },
    getTitleOrder(index){

    },
    getTitleIndex(index){
      let insList = this.insList
      // insurant存在的个数
      let realTotal = 0
      // 删除后存在的被保人的索引
      let resultIndex = 0
      Object.keys(insList).map((item,key) => {
        if(insList[item]){
          realTotal = realTotal + 1
          // if(index>=parseInt(item)){
          //   resultIndex = resultIndex + 1
          // }
        }
      })
      return index==0&&realTotal==1?'被保人信息':'第'+(index+1)+'被保人'
    },
    occupationChange(code){
      this.applicantChange('',{name:'occupation',value:code})
    },
    // 投保人信息变更，如果关系为本人要复制到被保人
    applicantChange(eventType,obj){

      //如果修改了投保人信息，重新生成planId
      let query = {...this.$route.query}
      if(query.planId){
        delete query.planId
        this.$router.replace({ name: this.$route.name, query: query})
      }

      let insData = this.formCollection['ins0'].formValues
      if(insData['relation'] === '00'){
        this.$set(this.insList[0][obj.name], 'value', (typeof obj.value=='string')?obj.value:obj.value[0])
      }
      // 如果切位配偶，那么性别取反，并且不可编辑
      let insList = this.insList
      if (obj.name === "genderCode" && insData.relation === '02'){
        let sex = obj.value
        if (sex == 'M') {
          this.$set(insList[0].genderCode, 'value', 'F')
        } else {
          this.$set(insList[0].genderCode, 'value', 'M')
        }
      }
    },
    subInsurantChange(eventType,obj){

    },
    insurantChange(eventType,obj){

      let insList = this.insList


      //如果切为本人，那么将投保人信息回填到被保人，并且被保人信息不可编辑
      if(obj.name === "relation" && obj.value[0] === '00'){

        this.selselfFlag = true;
        let applicantData = this.formCollection['applicant'].formValues
        Object.keys(insList[0]).map((item,key)=>{
          if(insList[0][item].rules && item!=='relation'){
            this.$nextTick(()=>{
              this.$set(insList[0][item].rules, 'readOnly', true)
              //表示其他关系切换到本人需要保留insureId
              if(applicantData.hasOwnProperty(item)){
                this.$set(insList[0][item], 'value', applicantData[item])
              }
            })
          }
        })
      }else if(obj.name === "relation" && obj.value[0] !== '00'){
        // 如果切位非本人关系，那么清空被保人信息，使其可编辑
        this.selselfFlag = false;
        let newIns = this.__deepCopy(firstInsModel)
        newIns.relation.value = obj.value[0]
        newIns.insureId.value = insList[0] ? insList[0].insureId.value : ''
        insList[0] = newIns
      }

      // 如果切位配偶，那么性别取反，并且不可编辑
      let appData = this.formCollection['applicant'].formValues
      if (obj.name === "relation" && obj.value[0] === '02'){
        let sex = appData.genderCode
        if (sex == 'M') {
          this.$set(insList[0].genderCode, 'value', 'F')
        } else {
          this.$set(insList[0].genderCode, 'value', 'M')
        }
        this.$set(insList[0].genderCode.rules, 'readOnly', true)
      }
    },
    //  ---------------------------------------------工具方法---------------------------------------------------------------
    validateAll() {
      // get form
      const forms = Object.keys(this.formCollection);
      // get form promised
      const formPromise = []
      forms.map(form =>
        this.formCollection[form]?formPromise.push(this.formCollection[form].validateAll()):''
      );
      return Promise.all(formPromise).then(res => {
        let unsolved = res.find(i => i !== true);
        if (unsolved === undefined) {
          return true;
        } else {
          return unsolved;
        }
      }).catch(e => {
        console.log(e);
      });
    },
    formatDate (date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
        }
      }
      return fmt;
    },
    padLeftZero (str) {
      return ('00' + str).substr(str.length);
    },
    processTime(time){
      return this.formatDate(new Date(time), 'yyyy-MM-dd');
    },
    initTime(time){
      let pattern = /^(\d{4})(.*)/
      let stimearr = time.match(pattern);
      let stime = '1940-01-01'
      let etime = parseInt(stimearr[1])-0 + stimearr[2] ;

      this.applicantData.birthday.rules.stime = stime;
      this.applicantData.birthday.rules.etime = etime;
      this.insList[0].birthday.rules.etime = etime;
      otherInsModel.birthday.rules.etime = etime;
    },
    //  ---------------------------------------------提交数据---------------------------------------------------------------
    nextStep() {
      // 创建建议书时， 添加 "planTypeFlag":"sharePlan"
      const { planId } = this.$route.query
      let submitData = {insurants:[], planTypeFlag: "sharePlan", planId}
      this.validateAll().then(res => {
        if (res === true) {
          //校验通过，获取表单值
          /* 判断被保人1和投保人关系为配偶时不能性别一样 START */
          let applicant_val = this.formCollection.applicant.formValues
          let ins0_val = this.formCollection.ins0.formValues
          if (ins0_val.relation == '02') {
            if (applicant_val.genderCode == ins0_val.genderCode) {
              this.$vux.toast.show({ text: '投被保人关系为配偶，投被保人性别均为男' });
              return
            }
          }
          /* 判断被保人1和投保人关系为配偶时不能性别一样 END */
          const forms = Object.keys(this.formCollection);
          forms.map((item,key) => {
            if(item === 'applicant'){
              submitData[item] = this.formCollection[item].formValues
            }else if(this.formCollection[item]){
              let insForm = this.formCollection[item].formValues
              insForm['insureSeq'] = key
              submitData['insurants'].push(insForm)
            }
          })
          this.submit(submitData)
        } else {
          let errorMsg = res.getErrorMsg();
          this.$vux.toast.show({ text: errorMsg });
        }
      });
    }
  },
  components: {
    formUnit,
    zaInput,
    zaSelect,
    zaTitle,
    zaOccupation
  }
}
