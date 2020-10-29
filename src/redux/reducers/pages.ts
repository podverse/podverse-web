import { actionTypes } from '~/redux/constants'

// TODO: this produces a "Expression produces a union type that is too complex to represent" linter error.
// How can we fix that?
// eslint-disable-next-line
// @ts-ignore
const generateDataObj = payload => {
  if (payload) {
    const { categoryId, filterText, isAdvancedFilterShowing, isSearching, lastScrollPosition,
      listItems, listItemsTotal, podcast, publicUser, queryFrom, queryPage, querySort,
      queryType, searchBy, searchText, selected } = payload

    return {
      ...(categoryId || categoryId === null ? { categoryId } : {}),
      ...(filterText || filterText === '' ? { filterText } : {}),
      ...(isAdvancedFilterShowing || isAdvancedFilterShowing === false ? { isAdvancedFilterShowing } : {}),
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

      const obj1 = generateDataObj(action.payload)

      return {
        ...state,
        [action.payload.pageKey]: {
          ...state[action.payload.pageKey],
          ...obj1
        }
      }

    default:
      return state
  }
}
