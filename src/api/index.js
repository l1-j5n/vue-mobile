import store from 'src/store'
const env = {
  get inApp () {
    return store.getters.inApp
  }
}
// 全局开启本地mock
const GlobalMock = true
let root = ''
export const isPro = () => process.env.NODE_ENV === 'production'
export const mock = process.env.MOCK
console.warn('mock model :::', mock)
if (isPro()) {
  root = '/api'
} else {
  root = '/testapi'
  root = 'http://fosun-test.zaouter.com/api'
  // root = 'http://uat-ipolicy.fosun-uhi.com/api'
  // root = '/devapi'
}
let path = (inf = null, n) => {
  let result = ''
  if (isPro()) {
    result = root + inf
  } else {
    switch (mock) {
    case 'local':
      result = root + '/local' + inf
      break
    case 'cross':
      result = root + '/cross' + inf
      break
    case 'mixin':
      if (n||GlobalMock) {
        //result = root + '/local' + inf
        result = root + inf
      } else {
        result = root + '/cross' + inf
        // result = root + '/cross/api' + inf
      }
      break
    }
  }
  return result
}
const deco = (app, share) => {
  return root + (env.inApp ? app : share || app)
}
/*
corss  请求远端
local  请求本地mock Json 文件

example:
export const ILOGIN = root + login
*/
// 查询投保步骤，steps
export const QUERYPROGRESS = path('/applyProgress/queryProgress')
// 分享建议书
export const SHAREPROPOSAL = path('/noLogin/moreInsureShareProposal')
// 预约投保
export const SAVEAPPOINTMENT = path('/noLogin/plan/saveAppointment')
//加载多被保人建议书
export const LOADPROLIST = path('/plan/moreInsureLoadProList')
//加载所有可选主险列表
export const MAININSLIST = path('/chooseMainIns/mainInsList')
//保存所选产品列表
export const SETPRODUCTLIST = path('/plan/moreInsureSetProductList')
//保存所选产品
export const SETPRODUCT = path('/plan/moreInsureSetProduct')
//加载所有被保人
export const LOADALLINSURANT = path('/proposal/loadMoreInsureProposal')
//加载所有可选附险列表
export const SETRIDERINSLIST = path('/plan/moreInsureSetRiderList')
//保存所选产品列表=附加险
export const LOADRIDERINSLIST = path('/chooseRider/moreInsGetRiderList')
//remove所选产品
export const RMVPRODUCT = path('/plan/moreInsureRemoveProduct')
// 检验计划书状态
export const CHECKRULE = path('/plan/moreInsureCheckRule')

export const LOADAPPLY = path('/plan/loadApply')
export const BENEFICIARTYLIST = path('/plan/beneficiaryIist')
// 预览计划书
export const VIEWPLAN = path('/plan/moreInsureLoadPlan')
export const MOREINSURESHOWBENEFITCOVERAGE = path('/plan/moreInsureShowBenefitCoverage')
export const BENEFICIARCUSTUMER= path('/plan/benefictaryCustomer')
// 获取客户信息，通过custId
export const GETCUSTM = path('/customer/getDetail')
// 初始化完善信息
export const LOADAPPLYWITHMULTIINSURANTS = path('/apply/multiInsurants/loadApplyWithMultiInsurants')
// 保存投被保人信息
export const SAVEAPPLIANTADDINSURANT = path('/apply/multiInsurants/saveApplicantAndMultiInsurants')
// 查询被保人信息
export const QUERYINSURANT = path('/apply/multiInsurants/query')
// 单个被保人信息保存
export const SAVESINGLEINSURANT = path('/apply/multiInsurants/saveSingleInsurant')
// 单个受益人删除
export const DELETEBENEFICTARY = path('/apply/multiInsurants/deleteSingleBenefictory')
// 修改受益人信息
export const UPDATEBENEFICTARY = path('/benefictary/update')
// 保存受益人信息（指定受益人）
export const SAVEASSIGNBEBEFICTORY = path('/apply/multiInsurants/saveSingleBenefictory')
// 保存受益人信息
export const SAVEBENEFICTARY = path('/benefictary/save')
// 受益人规则校验（指定受益人）
// 投被保人告知初始化
export const INITAPPLICANTANDINSURANTINFORM = path('/apply/multiInsurants/inform/insured/initApplicantAndInsurantInform')
// 保存单个被保人告知
export const SAVESINGLEINSURANTIMPART = path('/apply/multiInsurants/saveSingleInsurantImpart')
// 保存投保人告知
export const SAVESINGLEAPPIMPART = path('/apply/multiInsurants/inform/applicant/save')
export const CHECKBENEFICTATY = path('/apply/multiInsurants/checkBenefictary')
//删除被保人
export const DELETEINSURER = path('/proposal/deletePlanInsurant')
//预览投保书
export const VIEWINSURERPACT = path('/apply/multiInsurants/loadPreviewWithMultiInsurants')
export const PREUNDERWRITING = path('/apply/multiInsurants/preUnderWriting')  //预投保
//电子签名页-查看税收信息
export const TAX_INFO = path('/apply/loadTaxInfo')
/** 电子签名页-税收信息保存 **/
export const APP_TAX_HOLD = path('/apply/saveSubTaxInfo')

/** 进度处理start **/
export const PROGRESSTAB = root + '/applyProgress/queryTabs'  // TAB栏
export const INSBENEFICARYINFOR = root + '/benefictary/query' // 受益人信息列表
export const INSBENEFICARYINFORDEL = root + '/benefictary/delete' // 删除受益人
export const INSBENEFICARYINFORUP = root + '/benefictary/update' // 修改受益人
export const INSBENEFICARYINFORSAVE = root + '/benefictary/save' // 保存受益人
export const INSBENEFICARYINFORNEXTSTEP = root + '/benefictary/checkBenefictary' // 受益人下一步
export const INPROGRESSLIST = root + '/applyProgress/queryList' // 外网数据：progresslist
export const IPROGRESSDETAIL = '/progressdetail' // 投保进度 详情列表
export const IPROGRESS = '/progress' // 投保进度建议书
export const IPROGRESSINSURE = '/progressinsure' // 投保进度投保书
export const IPROGRESSPAY = '/progresspay' // 投保进度已支付
export const IPROGRESSFINISH = '/progressfinish' // 投保进度已完成
export const IPROGRESSDELE = '/progressdele' // 投保进度已作废
export const ISAMULET = '/isamulet'// 护身符
export const PROGRESSDEL = root + '/applyProgress/deleteApply' // 删除建议书
export const PROGRESSCOPY = root + '/applyProgress/copyApply' // 复制建议书
/** 进度处理end **/

/** 收回空中签名 **/
export const DE_SIGN_AIR = root + '/apply/multiInsurants/air/airSignBack'
/** 收回空中支付 **/
export const DE_PAY_AIR = root + '/apply/air/airPayBack'
export const PROGRESSLOADAPPLY = root + '/api/apply/loadApply'
export const LOADPROPOSAL = path('/proposal/loadMoreInsureProposal')
export const GETNOTIFY = path('/notify/simpleInform')
export const CREATMOREINSUREPROPOSAL = path('/proposal/createMoreInsureProposal')
//产品详情
export const  SHARE_I_PRODUCTDETAIL = path('/productCenter/productDetailForApp')
export const IPRODUCTDETAIL = path('/productCenter/productDetailForApp')
// 名片
export const IBUSSINESSCARD = root + '/noLogin/getUserInformation'
export const IBUSINESSCARDSHARING = root + '/noLogin/share/businessCardSharing'


/** 保单查询start **/
export const IPROGRESQUERY = '/progressquery'
export const ISEARCHLIST = root + '/policy/list'
export const ISEARCHDETAIL = root + '/policy/detail'
export const ISBANKS = '/banks' // 银行list
/** 保单查询end **/

/*********电子签名接口*************/

/** 电子签名页： 保存保单信息 **/
export const SIGN_E_SAVE = path('/apply/multiInsurants/saveMainInfoWithMultiInsurants')
/** 获取初始化空中签名分享链接的数据 **/
export const INFO_SHARE_SIGNATURE = path('/apply/multiInsurants/air/shareAirSign')
/** 获取重新支付信息 **/
export const LOADPAYINFO = path('/apply/loadPayInfo')
/** 重新支付信息 **/
export const PAYSUBMIT = path('/apply/paySubmit')
/** 作废投保 **/
export const DELETEAPPLY = path('/applyProgress/deleteApply')
/** 发送验证码 **/
export const SMSSEND = path('/sms/send')
/** alias, but more friendly **/
export const SMS_SEND = path('/sms/send')
export const SMS_SEND_SHARE = path('/noLogin/sms/send')
/** 验证验证码 **/
export const SMSVERIFY = path('/sms/verify')
export const SMS_VERIFY_SHARE = root + '/noLogin/sms/verify'

/** 获取银行列表 **/
export const GET_BANK_LIST = path('/noLogin/apply/air/loadDict?dictName=bankcode')
/** 国籍列表 **/
export const GET_CITIZENSHIP_LIST = path('/noLogin/apply/air/loadDict?dictName=citizenship')
export const APPLYSUBMIT = path('/apply/applySubmit')
export const IRESULTSUCC = path('/resultsucc') // 查看结果 - 成功
/*********电子签名接口*************/

/** 根据planId 拉取对应步骤 **/
export const STEPS = path('/applyProgress/queryAllApplyStep')
/** 获取当前时间 **/
export const CURRENTTIME = path('/getSystemTime')

// 图片上传
export const UPLOAD = root + '/uploadOssFile'
// 人脸识别
export const VERIFY_CERT = root + '/compareLib'

/**
 * 相关的接口应组织在一起
 */
export default {
  TAX: {
    // 切换是否是中国税收居民(签名页面)
    get TOGGLE () {
      return deco('/apply/changeSignInfo', '/noLogin/apply/air/changeSignInfo')
    }
  },
  // 切换是否是双录保单
  DOUBLE_RECORD: {
    get TOGGLE () {
      return deco('/apply/changeSignInfo', '/noLogin/apply/air/changeSignInfo')
    }
  },
  CA: {
    get RESET () { // 清空CA信息
      return deco('/apply/clearCaInfo')
    }
  },
  SIGN: {
    get LOAD () { // 加载签名信息
      return deco(
        '/apply/multiInsurants/loadMainInfoWithMultiInsurants',
        '/noLogin/apply/multiInsurants/air/loadAirSignInfo'
      )
    },
    get SUBMIT () { // 提交签名
      return deco('/apply/multiInsurants/applySubmit', '/noLogin/apply/multiInsurants/air/submitAirSign')
    },
    CACHE: {
      get CA () { // 缓存签名中的CA信息
        return deco('/apply/saveCaInfoNoSign', '/noLogin/apply/air/saveCaInfoNoSign')
      },
      get UPLOAD () { // 缓存签名中的上传资料
        return deco('/apply/uploadImageInfoNoCheck', '/noLogin/apply/air/uploadImageInfoNoCheck')
      },
      get PAY () { // 缓存签名中的支付信息
        return deco('/apply/saveSubPayInfo', '/noLogin/apply/air/saveSubPayInfo')
      }
    }
  },
  CODE_VERIFY: {
    get SEND () {
      return deco('/sms/multiInsurants/send', '/noLogin/sms/multiInsurants/send')
    },
    get VERIFY () {
      return deco('/sms/verify', '/noLogin/sms/verify')
    }
  },
  APPLY: {
    get STATUS () {
      return deco('/applyProgress/queryApplyStatus')
    }
  }
}

