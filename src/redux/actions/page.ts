import { actionTypes } from '~/redux/constants'

export const pageIsLoading = payload => {
  return {
    type: actionTypes.PAGE_IS_LOADING,
    payload
  }
}
