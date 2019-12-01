
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Pagination } from 'podverse-ui'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import config from '~/config'
import { getViewContentsElementScrollTop } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getPublicUsersByQuery } from '~/services'
import Link from 'next/link';
const uuidv4 = require('uuid/v4')
const { QUERY_MEDIA_REFS_LIMIT } = config()

type Props = {
  handleSetPageQueryState: Function
  pageIsLoading?: any
  pageKey?: string
  pages?: any
  queryPage?: number
  settings?: any
  user?: any
}

type State = {}

class UserListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    handleSetPageQueryState: () => { },
    pageKey: 'default',
    queryPage: 1
  }

  queryUserListItems = async (page = 1) => {
    const { handleSetPageQueryState, pageKey, settings, user } = this.props
    const { nsfwMode } = settings

    let query: any = { page }

    handleSetPageQueryState({
      pageKey,
      queryPage: page
    })

    try {
      query.userIds = user.subscribedUserIds

      const response = await getPublicUsersByQuery(query, nsfwMode)
      const users = response.data

      handleSetPageQueryState({
        pageKey,
        listItems: users[0],
        listItemsTotal: users[1]
      })
    } catch (error) {
      console.log(error)
    }
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  handleQueryPage = async page => {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
    await this.queryUserListItems(page)
    pageIsLoading(false)

    const mediaListSelectsEl = document.querySelector('.media-list__selects')
    if (mediaListSelectsEl) {
      mediaListSelectsEl.scrollIntoView()
    }
  }

  render() {
    const { pageKey, pages } = this.props
    const { listItems, listItemsTotal, queryPage } = pages[pageKey]

    const listItemNodes = listItems && listItems.map(x => {
      return (
        <MediaListItemCtrl
          key={`media-list-item-${uuidv4()}`}
          mediaListItemType='user'
          pageKey={pageKey}
          profileUser={x} />
      )
    })

    return (
      <div className='media-list reduced-margin adjust-top-position'>
        {
          listItemNodes && listItemNodes.length > 0 &&
          <Fragment>
            {listItemNodes}
            <Pagination
              currentPage={queryPage || 1}
              handleQueryPage={this.handleQueryPage}
              pageRange={2}
              totalPages={Math.ceil(listItemsTotal / QUERY_MEDIA_REFS_LIMIT)} />
          </Fragment>
        }
        {
          (!listItemNodes || listItemNodes.length === 0) &&
          <div className='no-results-msg'>
            <p>You are not subscribed to any user profiles.</p>
            <p>Visit the <Link as='/settings' href='/settings'><a onClick={this.linkClick}>Settings page</a></Link> to make your profile public and share your profile with friends.</p>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserListCtrl)
