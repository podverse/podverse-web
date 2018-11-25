import { actionTypes } from "~/redux/constants";

export const userSetInfo = payload => {
  return {
    type: actionTypes.USER_SET_INFO,
    payload
  }
}
