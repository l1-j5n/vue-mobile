export default {
  name: {
    value: '',
    rules: {
      label: '投保人',
      type: 'za-input',
      readOnly: false,
      vRules: 'required',
      placeholder: '请输入姓名',
      errorMsg: '请输入姓名'
      // extra: {
      //   text: '万元'
      // }
    }
  },
  genderCode: {
    value: 'M',
    rules: {
      label: '性别',
      type: 'za-sex',
      vRules: 'required',
      placeholder: '请选择',
      errorMsg: '请选择性别'
    }
  },
  birthDay: {
    value: '',
    rules: {
      label: '出生日期',
      type: 'za-date',
      vRules: 'required',
      // readOnly: true,
      placeholder: '请选择出生日期',
      errorMsg: '请选择出生日期'
    }
  },
  certType: {
    value: '',
    rules: {
      label: '证件类型',
      type: 'za-select',
      showName:true,
      readOnly: false,
      vRules: 'required',
      placeholder: '请选择证件类型',
      options: [[
        {
          "value": "0",
          "name": "身份证"
        },
        {
          "value": "1",
          "name": "护照"
        },
        {
          "value": "2",
          "name": "军人证（军官证）"
        },
        {
          "value": "4",
          "name": "户口本"
        },
        {
          "value": "7",
          "name": "出生证"
        },
        {
          "value": "A",
          "name": "士兵证"
        },
        {
          "value": "B",
          "name": "回乡证"
        },
        {
          "key": "E",
          "name": "台胞证"
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
      vRules: 'required|isFullWidth',
      placeholder: '请输入证件号码',
      errorMsg: '请输入证件号码'
    }
  },


}
