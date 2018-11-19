import { actionTypes } from "~/redux/constants";

export const userSetIsLoggedIn = payload => {
  return {
    type: actionTypes.USER_SET_IS_LOGGED_IN,
    payload
  }
}
