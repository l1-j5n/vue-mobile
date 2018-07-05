import StepTypes from './StepTypes'

// 定义某个步骤只可能属于那个组
const stepBelongs = [
  {
    name: '制作建议书',
    steps: [
      StepTypes.CustomerBasic,
      StepTypes.JoinProduct,
      StepTypes.PreviewAssurances
    ]
  },
  {
    name: '制作投保书',
    steps: [
      StepTypes.CompleteCustomer,
      StepTypes.JoinBeneficiaries,
      StepTypes.ApplicantNotify,
      StepTypes.InsuredNotify,
      StepTypes.PreviewApplication
    ]
  },
  {
    name: '电子签名',
    step: StepTypes.ESign
  },
  {
    name: '支付保费',
    step: StepTypes.Pay
  }
]
export default stepBelongs
