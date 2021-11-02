import { actionTypes } from '~/redux/constants'

export const pagesSetQueryState = payload => {
  return {
    type: actionTypes.PAGES_SET_QUERY_STATE,
    payload
  }
}

export const pagesClearQueryState = payload => {
  return {
    type: actionTypes.PAGES_CLEAR_QUERY_STATE,
    payload
  }
}
