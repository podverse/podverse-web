import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import UserListCtrl from '~/components/UserListCtrl/UserListCtrl'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getPublicUsersByQuery } from '~/services'

type Props = {
  listItems?: any
  pagesSetQueryState?: any
  queryPage: number
}

type State = {}

const kPageKey = 'public_profiles'

class Profiles extends Component<Props, State> {

  static async getInitialProps({ query, store }) {
    const state = store.getState()
    const { pages, user } = state

    const currentPage = pages[kPageKey] || {}
    const queryPage = currentPage.queryPage || query.page || 1

    if (Object.keys(currentPage).length === 0) {
      const response = await getPublicUsersByQuery({ 
        userIds: user.subscribedUserIds
      })
      const listItems = response.data

      store.dispatch(pagesSetQueryState({
        endReached: listItems.length < 50,
        pageKey: kPageKey,
        listItems,
        queryPage
      }))
    }

    store.dispatch(pageIsLoading(false))

    return { }
  }

  render() {
    const { pagesSetQueryState, queryPage } = this.props

    return (
      <Fragment>
        <h3>Profiles</h3>
        <UserListCtrl
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={kPageKey}
          queryPage={queryPage} />
      </Fragment>
    )
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Profiles)
