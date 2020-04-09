import { actionTypes } from '~/redux/constants'

// TODO: this produces a "Expression produces a union type that is too complex to represent" linter error.
// How can we fix that?
// eslint-disable-next-line
// @ts-ignore
const generateDataObj = payload => {
  if (payload) {
    const { categoryId, filterIsShowing, filterText, isSearching, lastScrollPosition,
      listItems, listItemsTotal, podcast, publicUser, queryFrom, queryPage, querySort,
      queryType, searchBy, searchText, selected } = payload

    return {
      ...(categoryId || categoryId === null ? { categoryId } : {}),
      ...(filterIsShowing || filterIsShowing === false ? { filterIsShowing } : {}),
      ...(filterText || filterText === '' ? { filterText } : {}),
      ...(isSearching || isSearching === false ? { isSearching } : {}),
      ...(lastScrollPosition || lastScrollPosition === 0 ? { lastScrollPosition } : {}),
      ...(listItems ? { listItems } : {}),
      ...(listItemsTotal || listItemsTotal === 0 ? { listItemsTotal } : {}),
      ...(podcast ? { podcast } : {}),
      ...(publicUser ? { publicUser } : {}),
      ...(queryFrom ? { queryFrom } : {}),
      ...(queryPage ? { queryPage } : {}),
      ...(querySort ? { querySort } : {}),
      ...(queryType ? { queryType } : {}),
      ...(searchBy ? { searchBy } : {}),
      ...(searchText || searchText === '' ? { searchText } : {}),
      ...(selected ? { selected } : {})
    }
  }

  return {}
}

export default (state = {}, action) => {
  const dataObj = generateDataObj(action.payload)
  
  switch (action.type) {
    case actionTypes.PAGES_CLEAR_QUERY_STATE:
      if (!action.payload.pageKey) {
        return state
      }
      
      return {
        ...state,
        [action.payload.pageKey]: {}
      }
    case actionTypes.PAGES_SET_QUERY_STATE:
      if (!action.payload.pageKey) {
        return state
      }

      return {
        ...state,
        [action.payload.pageKey]: {
          ...state[action.payload.pageKey],
          ...dataObj
        }
      }
    default:
      return state
  }
}
