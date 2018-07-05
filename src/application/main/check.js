import Vue from 'vue'
import {getBirthday, getSex, getAge} from '@/widget/util/index'
export const lingageChecke = (data)=>{
  if(data.certType === "01") {
    if(getBirthday(data.certNo) !== data.birthday){
      Vue.$vux.toast.show({text: "录入的身份证号与出生日期不相符"})
      return false
    }
    if(getSex(data.certNo) !== data.genderCode) {
      Vue.$vux.toast.show({text: "录入的身份证号与性别不相符"})
      return false
    }
  }
  else if(data.certType === "02" || data.certType === "12"){
    if(getAge(data.birthday)>=18){
      Vue.$vux.toast.show({text: "年龄大于等于18周岁，证件类型不能选择户口本或出生证，请重新选择证件类型"})
      return false
    }
  }
  if(data.citizenship === "CHN"){
    if(data.certType === 'A' || data.certType === '11' || data.certType === '10'){
      Vue.$vux.toast.show({text: "中国国籍客户不得用护照、回乡证、台胞证投保,请重新选择证件类型"})
      return false
    }
  }
  else if(data.citizenship === "HKG" || data.citizenship === "MAC"){
    if(data.certType != "11"){
      Vue.$vux.toast.show({text: "香港或澳门客户只能使用回乡证投保,请重新选择证件类型"})
      return false
    }
  }
  else if(data.citizenship === "TWN"){
    if(data.certType != "10"){
      Vue.$vux.toast.show({text: "台湾客户只能使用台胞证，请重新选择证件类型"})
      return false
    }
  }
  else{
    if(data.certType!= "A"){
      Vue.$vux.toast.show({text: "非中国及港澳台客户只能使用护照投保，请重新选择证件类型"})
      return false
    }
  }
  return true
}