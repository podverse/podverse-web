const passwordValidator = require('password-validator')

const schema = new passwordValidator()

const validatePasswordSchema = schema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()

export const validatePassword = password => {
  return validatePasswordSchema.validate(password)
}

export const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const validateHasAtLeastXCharacters = (str?: string, x = 8) => {
  return str && str.match(`^(?=.{${x},})`) ? true : false
}

export const validateHasLowercase = (str?: string) => {
  return str && str.match('^(?=.*[a-z])') ? true : false
}

export const validateHasMatchingStrings = (str1?: string, str2?: string) => {
  return str1 && str1 === str2 ? true : false
}

export const validateHasNumber = (str?: string) => {
  return str && str.match('^(?=.*[0-9])') ? true : false
}

export const validateHasUppercase = (str?: string) => {
  return str && str.match('^(?=.*[A-Z])') ? true : false
}
