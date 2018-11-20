import { actionTypes } from "~/redux/constants";

export const modalsForgotPasswordShow = payload => {
  return {
    type: actionTypes.MODALS_FORGOT_PASSWORD_SHOW,
    payload
  }
}

export const modalsForgotPasswordIsLoading = payload => {
  return {
    type: actionTypes.MODALS_FORGOT_PASSWORD_IS_LOADING,
    payload
  }
}

export const modalsLoginShow = payload => {
  return {
    type: actionTypes.MODALS_LOGIN_SHOW,
    payload
  }
}

export const modalsLoginIsLoading = payload => {
  return {
    type: actionTypes.MODALS_LOGIN_IS_LOADING,
    payload
  }
}

export const modalsSignUpShow = payload => {
  return {
    type: actionTypes.MODALS_SIGN_UP_SHOW,
    payload
  }
}

export const modalsSignUpIsLoading = payload => {
  return {
    type: actionTypes.MODALS_SIGN_UP_IS_LOADING,
    payload
  }
}
