const ID = typeof Symbol === 'function' ? identify => Symbol(identify) : identify => identify
const StepTypes = {
  NativeView: ID('native界面'),
  CustomerBasic: ID('客户信息'),
  JoinProduct: ID('保险计划'),
  PreviewAssurances: ID('预览计划书'),
  ShareAssurances: ID('分享计划书'),
  CompleteCustomer: ID('完善客户信息'),
  JoinBeneficiaries: ID('受益人'),
  ApplicantNotify: ID('投保人告知'),
  InsuredNotify: ID('被保险人告知'),
  AgentNotify: ID('代理人告知'),
  PreviewApplication: ID('预览投保书'),
  ESign: ID('电子签名'),
  Pay: ID('支付保费'),
  End: ID('投保结果')
}
Object.freeze(StepTypes)
export default StepTypes
