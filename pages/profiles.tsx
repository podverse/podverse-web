import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import UserListCtrl from '~/components/UserListCtrl/UserListCtrl'
import { getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getPublicUsersByQuery } from '~/services'

type Props = {
  lastScrollPosition?: number
  listItems?: any
  meta?: any
  pageKey?: string
  pagesSetQueryState?: any
  queryPage: number
}

type State = {}

const kPageKey = 'public_profiles'

class Profiles extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { pages, user } = state

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryPage = currentPage.queryPage || query.page || 1
console.log(currentPage)
    if (Object.keys(currentPage).length === 0) {
      const response = await getPublicUsersByQuery({ 
        userIds: user.subscribedUserIds
      })
      const users = response.data

      store.dispatch(pagesSetQueryState({
        pageKey: kPageKey,
        listItems: users[0],
        listItemsTotal: users[1],
        queryPage
      }))
    }

    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: `My subscribed profiles on Podverse`,
      title: `Profiles`
    }

    return { lastScrollPosition, meta, pageKey: kPageKey }
  }

  render() {
    const { meta, pageKey, pagesSetQueryState, queryPage } = this.props

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={true}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <h3>Profiles</h3>
        <UserListCtrl
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={pageKey}
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
