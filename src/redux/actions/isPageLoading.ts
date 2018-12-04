import { actionTypes } from "~/redux/constants";

export const isPageLoading = payload => {
  return {
    type: actionTypes.IS_PAGE_LOADING,
    payload
  }
}
