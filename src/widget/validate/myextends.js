
let trimStr = function (str) {
  return str
    ? str.replace(/(^\s*)|(\s*$)/g, '')
    : ''
}

export const passport = {
  messages: {
    cn: (field, args) => '护照录入信息不正确'
  },
  validate: (value, args) => {
    return trimStr(value).length>=7 && trimStr(value).length<=20
  }
}

export const taipassport = {
  messages: {
    cn: (field, args) => '台胞证录入信息不正确'
  },
  validate: (value, args) => {
    return trimStr(value).length>=10
  }
}
export const reentrypermit = {
  messages: {
    cn: (field, args) => '回乡证录入信息不正确'
  },
  validate: (value, args) => {
    return trimStr(value).length>=10
  }
}
export const register = {
  messages: {
    cn: (field, args) => '录入的户口本证件号与现有户口本证件号规则不符，请核实。'
  },
  validate: (value, args) => {
    return trimStr(value).length===18
  }
}
export const checkbenefit = {
  messages: {
    cn: (field, args) => '受益比例必须是在1-100之间'
  },
  validate: (value, args) => {
    return /^(([1-9]\d?)|100)$/.test(parseFloat(value))
  }
}

export const iszero = {
  messages: {
    cn: (field, args) => '请输入正确的数字'
  },
  validate: (value, args) => {
    return !(/^0+[1-9][\d|\.]*$/.test(value) || /^0{2,}$/.test(value))
  }
}

export const birthcertificate = {
  messages: {
    cn: (field, args) => '出生证录入信息不正确'
  },
  validate: (value, args) => {
    return /^[A-Za-z][0-9]{9}$/.test(trimStr(value))
  }
}



export const revenue = {
  messages: {
    cn: (field, args) => '税前年收入最多允许录入10位字符，且最多允许录入两位小数'
  },
  validate: (value, args) => {
    // return /^[0-9]+(.[0-9]{2})?$/.test(trimStr(value))
    return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(trimStr(value))
  }
}

export const height = {
  messages: {
    cn: (field, args) => '请输入正确的身高'
  },
  validate: (value, args) => {
    return /^\+?[1-9][0-9]*$/.test(value)
  }
}
export const weight = {
  messages: {
    cn: (field, args) => '请输入正确的体重'
  },
  validate: (value, args) => {
    return /^\+?[1-9][0-9]*$/.test(value)
  }
}

export const detailaddr = {
  messages: {
    cn: (field, args) => '输入的详细地址必须包含以下关键字：小区、楼、村、巷、胡同、里弄、号、大厦、栋、幢、室、单元、门、组、房、座、层、排；或者不少于8个字；请重新输入！'
  },
  validate: (value, args) => {
    return /小区|楼|村|巷|胡同|里弄|号|大厦|栋|幢|室|单元|门|组|房|座|层|排+|.{8,50}/.test(trimStr(value))
  }
}

export const emailcheck = {
  messages: {
    cn: (field, args) => '请输入正确的邮箱'
  },
  validate: (value, args) => {
    return /^(\w)+(\.\w+)*@(\w){2,}((\.\w+)+)$/.test(value)
  }
}


