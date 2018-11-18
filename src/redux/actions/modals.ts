import { actionTypes } from "~/redux/constants";

export const modalsShowLogin = () => {
  return {
    type: actionTypes.MODALS_SHOW_LOGIN
  }
}

export const modalsHideLogin = () => {
  return {
    type: actionTypes.MODALS_HIDE_LOGIN
  }
}
