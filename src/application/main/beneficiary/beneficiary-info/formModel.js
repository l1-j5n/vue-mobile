export default {
  // basicTitle: {
  //   rules: {
  //     label: '受益人信息',
  //     type: 'title'
  //   }
  // },
  relation: {
    value: '',
    rules: {
      label: '与被保险人关系',
      type: 'za-select',
      vRules: 'required',
      placeholder: '与被保险人关系',
      errorMsg: '与被保险人关系',
      showName: true,
      options: [[
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
  genderCode: {
    value: 'M',
    rules: {
      label: '性别',
      type: 'za-sex',
      vRules: 'required',
      placeholder: '请选择性别',
      errorMsg: '请选择性别'
    }
  },
  // 是否投保人 字段内容0
  custType: {
    value: '',
    rules: {
      label: '是否投保人',
      type: 'za-yesno',
      vRules: 'required',
      errorMsg: '请选择是否投保人'
    }
  },
  birthday: {
    value: '',
    rules: {
      label: '出生日期',
      type: 'za-date',
      vRules: 'required',
      placeholder: '请选择出生日期',
      errorMsg: '请选择出生日期'
    }
  },
  certType: {
    value: '',
    rules: {
      label: '证件类型',
      type: 'za-select',
      vRules: 'required',
      showName: true,
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
      placeholder: '请输入证件号码',
      errorMsg: '请输入证件号码'
    }
  },
  // // 有效期 certValidity
  certValidity: {
    value: '',
    rules: {
      label: '有效期至',
      type: 'za-date',
      vRules: 'required',
      placeholder: '请选择有效期',
      errorMsg: '请选择有效期'
    }
  },
  citizenship: {
    value: [],
    rules: {
      label: '国籍',
      type: 'za-select',
      vRules: 'required',
      placeholder: '请选择国籍',
      showName: true,
      errorMsg: '请选择国籍',
      options: [['中国 ', '美国', '俄罗斯', '英国']]
    }
  },
  benefitOrder: {
    value: '',
    rules: {
      label: '受益顺序',
      type: 'za-select',
      vRules: 'required',
      placeholder: '请选择受益顺序',
      errorMsg: '请选择受益顺序',
      options: [["1", "2", "3"]]
    }
  },
  benefitRatio: {
    value: '',
    rules: {
      label: '受益比例',
      type: 'title',
      type: 'za-input',
      vRules: 'checkbenefit',
      placeholder: '请输入受益比例',
      errorMsg: '请输入受益比例',
      extra: {
        text: '%'
      }
    }
  },
}
// required|ischeckbenefit