import { actionTypes } from "~/redux/constants";

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
