export const modelData = {
  basicTitle: {
    rules: {
      label: '基本信息',
      type: 'title'
    }
  },
  relation: {
    value: '',
    rules: {
      label: '与投保人关系',
      type: 'za-select',
      vRules: 'required',
      placeholder: '与投保人关系',
      errorMsg: '与投保人关系',
      showName: true,
      readOnly:false,
      options: [[
        {
          value: '00',
          name: '本人'  
        },
        {
          value: '01',
          name: '父母'
        },
        {
          value: '02',
          name: '配偶'
        },
        {
          value: '03',
          name: '子女'
        },
        {
          value: '04',
          name: '祖孙',
        },
        {
          value: '05',
          name: '监护'
        },
        {
          value: '06',
          name: '其他',
        },
        {
          value: '07',
          name: '保单服务人员'
        },
        {
          value: '08',
          name: '直系亲属'
        },
      ]]
    }
  },
  relationFristInsure: {
    value: '',
    rules: {
      label: '与第一被保险人的关系',
      type: 'za-select',
      vRules: 'required',
      placeholder: '与第一被保险人的关系',
      errorMsg: '与第一被保险人的关系',
      showName: true,
      readOnly:true,
      options: [[
        {
          value: '00',
          name: '本人'  
        },
        {
          value: '01',
          name: '父母'
        },
        {
          value: '02',
          name: '配偶'
        },
        {
          value: '03',
          name: '子女'
        },
        {
          value: '04',
          name: '祖孙',
        },
        {
          value: '05',
          name: '监护'
        },
        {
          value: '06',
          name: '其他',
        },
        {
          value: '07',
          name: '保单服务人员'
        },
        {
          value: '08',
          name: '直系亲属'
        },
      ]]
    }
  },
  name: {
    value: '',
    rules: {
      label: '姓名',
      type: 'za-input',
      vRules: 'required|username|usernameLength',
      placeholder: '请输入姓名',
      errorMsg: '请输入姓名'
    }
  },
  birthday: {
    value: '',
    rules: {
      label: '出生日期',
      type: 'za-date',
      vRules: 'required',
      readOnly:false,
      placeholder: '请选择出生日期',
      errorMsg: '请选择出生日期'
    }
  },
  genderCode: {
    value: '',
    rules: {
      label: '性别',
      type: 'za-sex',
      vRules: 'required',
      readOnly:false,
      placeholder: '请选择性别',
      errorMsg: '请选择性别'
    }
  },
  certType: {
    value: '',
    rules: {
      label: '证件类型',
      type: 'za-select',
      showName:true,
      vRules: 'required',
      readOnly:false,
      placeholder: '请选择证件类型',
      options: [[
        {
          "value": "01",
          "name": "身份证"
        },
        {
          "value": "02",
          "name": "户口本"
        },
        {
          "value": "03",
          "name": "驾照"
        },
        {
          "value": "04",
          "name": "军人证（军官证）"
        },
        {
          "value": "05",
          "name": "士兵证"
        },
        {
          "value": "10",
          "name": "台胞证"
        },
        {
          "value": "11",
          "name": "回乡证"
        },
        {
          "value": "12",
          "name": "出生证"
        },
        {
          "value": "99",
          "name": "其他"
        },
        {
          "value": "A",
          "name": "护照"
        },
        {
          "value": "B",
          "name": "学生证"
        },
        {
          "value": "C",
          "name": "工作证"
        },
        {
          "value": "D",
          "name": "无证件"
        },
        {
          "value": "E",
          "name": "外国人永久居留证"
        },
        {
          "value": "F",
          "name": "临时身份证"
        },
        {
          "value": "G",
          "name": "警官证"
        }
      ]],
      errorMsg: '请选择证件类型'
    }
  },
  certNo: {
    value: '',
    rules: {
      label: '证件号码',
      type: 'za-input',
      vRules: '',
      readOnly:false,
      placeholder: '请输入证件号码',
      errorMsg: '请输入证件号码'
    }
  },
  certValidity: {
    value: '',
    rules: {
      label: '有效期至',
      type: 'za-date',
      vRules: '',
      placeholder: '请选择有效期',
      errorMsg: '请选择有效期'
    }
  },
  citizenship: {
    value: [],
    rules: {
      label: '国籍',
      type: 'za-select',
      showName:true,
      vRules: 'required',
      placeholder: '请选择国籍',
      errorMsg: '请选择国籍',
      options: [['中国 ', '美国', '俄罗斯', '英国']]
    }
  },
  contactTitle: {
    rules: {
      label: '联系方式',
      type: 'title'
    }
  },
  // withAppliant: {
  //   value: 'N',
  //   rules: {
  //     label: '同被保人',
  //     type: 'za-yesno',
  //     vRules: 'required',
  //     showName:true,
  //     errorMsg: '同被保人'
  //   }
  // },
  mobile: {
    value: '',
    rules: {
      label: '手机号码',
      type: 'title',
      type: 'za-input',
      vRules: 'required|mobile|checkmobile',
      readOnly:false,
      placeholder: '请输入手机号码',
      errorMsg: '请输入手机号码'
    }
  },
  telphone: {
    value: '',
    rules: {
      label: '住宅电话',
      type: 'za-input',
      vRules: 'required|phonenum|acrossline',
      readOnly:false,
      placeholder: '请输入住宅电话',
      errorMsg: '请输入住宅电话'
    }
  },
  addr: {
    value: {
      "province": "",
        "provinceDesc": "",
        "city": "",
        "cityDesc": "",
        "district": "",
        "districtDesc": "",
        "detail": ""
    },
    rules: {
      label: '通讯地址',
      subLabel: '详细地址',
      type: 'za-address',
      vRules: 'required',
      showName:true,
      detail: {
        vRules: 'required|detailaddr|max:50',
      },
      placeholder: '请选择通讯地址',
      showDetail: true,
      errorMsg: '请选择通讯地址',
      options: [['xxxx', 'yyyyy', 'zzzzz']]
    }
  },
  zipcode: {
    value: '',
    rules: {
      label: '邮政编码',
      type: 'za-input',
      vRules: 'required|zipcode',
      placeholder: '请输入通讯地址邮政编码',
      errorMsg: '请输入邮政编码'
    }
  },
  email: {
    value: '',
    rules: {
      label: '邮箱地址',
      type: 'za-input',
      vRules: 'required|emailcheck|isFullWidth|max:50',
      readOnly:false,
      placeholder: '请输入邮箱地址',
      errorMsg: '请输入邮箱地址'
    }
  },
  supplementTitle: {
    rules: {
      label: '补充信息',
      type: 'title'
    }
  },
  companyName: {
    value: '',
    rules: {
      label: '工作单位',
      type: 'za-input',
      vRules: 'required|stringlength|min:8|max:50',
      readOnly:false,
      placeholder: '请输入工作单位',
      errorMsg: '请输入工作单位'
    }
  },
  jobContent: {
    value: '',
    rules: {
      label: '工作内容',
      type: 'za-input',
      vRules: 'required|stringlength|min:8|max:50',
      readOnly:false,
      placeholder: '请输入工作内容',
      errorMsg: '请输入工作内容'
    }
  },
  occupation: {
    value: [],
    rules: {
      label: '职业',
      type: 'za-select',
      // vRules: 'required',
      showName:true,
      placeholder: '请选择',
      readOnly:false,
      errorMsg: '请选择被保人职业',
      options: [[
        {
          name: '企业经理',
          value: '1050102'
        }, {
          name: '企业职能部门经理或主管',
          value: '1050103'
        },
        {
          name: '工厂、企业负责人',
          value: '1050104'
        },
        {
          name: '统计人员',
          value: '2060201'
        },
        {
          name: '保险推销员',
          value: '2070202'
        },
        {
          name: '营业员',
          value: '4010101'
        }
        // [['xxxx', 'yyyyy', 'zzzzz']]
      ]]
    }
  },
  marrige: {
    value: '',
    rules: {
      label: '婚姻状况',
      type: 'za-select',
      showName:true,
      vRules: 'required',
      placeholder: '请选择婚姻状况',
      errorMsg: '请选择婚姻状况',
      readOnly:false,
      options: [[
        {
          value: "0",
          name: "未婚"
        },
        {
          value: "1",
          name: "已婚"
        },
        {
          value: "2",
          name: "离异"
        },
        {
          value: "3",
          name: "丧偶"
        }
      ]]

    }
  },
  salary: {
    value: '',
    rules: {
      label: '税前年收入',
      type: 'za-input',
      vRules: 'required|iszero|decimal:2|max:10',
      placeholder: '请输入税前年收入',
      errorMsg: '请输入税前年收入',
      extra: {
        text: '万元'
      }
    }
  },
  height: {
    value: '',
    rules: {
      label: '身高',
      type: 'za-input',
      vRules: 'required|iszero|max:3|height',
      placeholder: '请输入身高',
      errorMsg: '请输入身高',
      extra: {
        text: '厘米'
      }
    }
  },
  weight: {
    value: '',
    rules: {
      label: '体重',
      type: 'za-input',
      vRules: 'required|iszero|max:3|weight',
      placeholder: '请输入体重',
      errorMsg: '请输入体重',
      extra: {
        text: '公斤'
      }
    }
  }
}
export const hemujiaModal = {
  hasHemujiaVisit: {
    value: '',
    rules: {
      label: '是否曾在和睦家就诊',
      type: 'za-yesno',
      vRules: 'required',
      errorMsg: '请选择是否是否曾在和睦家就诊'
    }
  },
  hemujiaRecord: {
    value: '',
    rules: {
      label: '和睦家病历号',
      type: 'za-input',
      vRules: '',
      placeholder: '请输入病历号',
      errorMsg: '请输入和睦家病历号'
    }
  },
}
