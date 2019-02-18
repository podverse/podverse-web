import { actionTypes } from '~/redux/constants'

const generateDataObj = payload => {
  if (payload) {
    const { categoryId, filterIsShowing, filterText, isSearching, listItems,
      listItemsTotal, podcast, publicUser, queryFrom, queryPage, querySort, queryType,
      searchBy, searchText, selected } = payload

    return {
      ...(categoryId ? { categoryId } : {}),
      ...(filterIsShowing || filterIsShowing === false ? { filterIsShowing } : {}),
      ...(filterText || filterText === '' ? { filterText } : {}),
      ...(isSearching || isSearching === false ? { isSearching } : {}),
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
    case actionTypes.PAGES_SET_QUERY_STATE:
      const pageKey = action.payload.pageKey
      if (!pageKey) {
        return state
      }

      return {
        ...state,
        [pageKey]: {
          ...state[pageKey],
          ...dataObj
        }
      }
    default:
      return state
  }

}
