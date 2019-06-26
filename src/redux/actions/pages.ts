import { actionTypes } from '~/redux/constants'

export const pagesSetQueryState = payload => {
  return {
    type: actionTypes.PAGES_SET_QUERY_STATE,
    payload
  }
}
