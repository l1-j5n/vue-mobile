export const formModel1 = {
  applicant: {
    value: '',
    rules: {
      label: '投保人',
      type: 'title'
    }
  },
  firstName: {
    value: '',
    rules: {
      label: '姓',
      type: 'za-input',
      vRules: 'required',
      placeholder: '英文或拼音',
      errorMsg: '投保人姓不能为空'
    }
  },
  familyName: {
    value: '',
    rules: {
      label: '名',
      type: 'za-input',
      vRules: 'required',
      placeholder: '英文或拼音',
      errorMsg: '投保人名不能为空'
    }
  },
  birthday: {
    value: '',
    rules: {
      label: '出生日期',
      type: 'za-date',
      vRules: 'required',
      placeholder: '请选择',
      errorMsg: '投保人出生日期不能为空'
    }
  },
  city: {
    value: '',
    rules: {
      label: '投保人现居地址',
      type: 'title'
    }
  },
  countryDesc: {
    value: '',
    rules: {
      label: '国家',
      type: 'za-input',
      vRules: 'required',
      placeholder: '中文、英文或拼音',
      errorMsg: '投保人现居地址国家不能为空'
    }
  },
  provinceDesc: {
    value: '',
    rules: {
      label: '省',
      type: 'za-input',
      vRules: 'required',
      placeholder: '中文、英文或拼音',
      errorMsg: '投保人现居地址省不能为空'
    }
  },
  cityDesc: {
    value: '',
    rules: {
      label: '市',
      type: 'za-input',
      vRules: 'required',
      placeholder: '中文、英文或拼音',
      errorMsg: '投保人现居地址市不能为空'
    }
  },
  detail: {
    value: '',
    rules: {
      label: '详细地址',
      type: 'za-input',
      vRules: 'required',
      placeholder: '中文、英文或拼音',
      errorMsg: '投保人现居地址详细地址不能为空'
    }
  }
}

export const formModel2 = {
  applicantBirthAddress: {
    value: '',
    rules: {
      label: '投保人出生地址',
      type: 'title'
    }
  },
  isBirthAddr: {
    value: 'Y',
    rules: {
      label: '同现居住地址',
      type: 'za-button_group',
      options: [{name: '是', value:'Y'},{name: '否', value:'N'}]
    }
  }
}

export const formModel2Add = 
{
  countryDesc: {
    value: "",
    rules: {
      label: "国家",
      type: "za-input",
      vRules: "required",
      placeholder: "中文、英文或拼音",
      errorMsg: "投保人出生地址国家不能为空"
    }
  },
  provinceDesc: {
    value: "",
    rules: {
      label: "省",
      type: "za-input",
      vRules: "required",
      placeholder: "中文、英文或拼音",
      errorMsg: "投保人出生地址省不能为空"
    }
  },
  cityDesc: {
    value: "",
    rules: {
      label: "市",
      type: "za-input",
      vRules: "required",
      placeholder: "中文、英文或拼音",
      errorMsg: "投保人出生地址市不能为空"
    }
  },
  detail: {
    value: "",
    rules: {
      label: "详细地址",
      type: "za-input",
      vRules: "required",
      placeholder: "中文、英文或拼音",
      errorMsg: "投保人出生地址详细地址不能为空"
    }
  }
}

export const formModel3 = {
  taxCountry: {
    value: '',
    rules: {
      label: '税收居民国(地区)',
      type: 'za-input',
      vRules: 'required',
      placeholder: '中文',
      errorMsg: '税收信息税收居民国(地区)不能为空'
    }
  },
  hasTaxPayerId: {
    value: 'Y',
    rules: {
      label: '纳税人识别号',
      type: 'za-button_group',
      options: [{name: '有', value:'Y'},{name: '无', value:'N'}]
    }
  },
  taxPayerId: {
    value: '',
    rules: {
      type: 'za-input',
      vRules: 'required',
      placeholder: '请输入纳税人识别号',
      errorMsg: '税收信息纳税人识别号不能为空'
    }
  }
}
