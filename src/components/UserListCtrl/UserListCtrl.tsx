
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { PVButton as Button } from 'podverse-ui'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import { pageIsLoading } from '~/redux/actions'
import { getPublicUsersByQuery } from '~/services'
import Link from 'next/link';
const uuidv4 = require('uuid/v4')

type Props = {
  handleSetPageQueryState: Function
  pageIsLoading?: any
  pageKey: string
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
    const { handleSetPageQueryState, pageKey, pages, settings, user } = this.props
    const { nsfwMode } = settings
    const { listItems } = pages[pageKey]

    let query: any = { page }

    handleSetPageQueryState({
      pageKey,
      isLoadingMore: true,
      queryPage: page
    })

    let combinedListItems: any = []

    if (page > 1) {
      combinedListItems = listItems
    }

    try {
      query.userIds = user.subscribedUserIds

      const response = await getPublicUsersByQuery(query, nsfwMode)
      const users = response.data
      combinedListItems = combinedListItems.concat(users)

      handleSetPageQueryState({
        pageKey,
        endReached: users.length < 50,
        isLoadingMore: false,
        listItems: page > 1 ? combinedListItems : users
      })
    } catch (error) {
      console.log(error)
      handleSetPageQueryState({
        pageKey,
        isLoadingMore: false
      })
    }
  }


  linkClick = () => {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
  }

  render() {
    const { pageKey, pages } = this.props
    const { endReached, isLoadingMore, listItems, queryPage } = pages[pageKey]

    const listItemNodes = listItems.map(x => {
      return (
        <MediaListItemCtrl
          key={`media-list-item-${uuidv4()}`}
          mediaListItemType='user'
          profileUser={x} />
      )
    })

    return (
      <div className='media-list reduced-margin adjust-top-position'>
        {
          listItemNodes && listItemNodes.length > 0 &&
          <Fragment>
            {listItemNodes}
            <div className='media-list__load-more'>
              {
                endReached ?
                  <p className='no-results-msg'>End of results</p>
                  : <Button
                    className='media-list-load-more__button'
                    disabled={isLoadingMore}
                    isLoading={isLoadingMore}
                    onClick={() => this.queryUserListItems(queryPage + 1)}
                    text='Load More' />
              }
            </div>
          </Fragment>
        }
        {
          (listItemNodes.length === 0) &&
          <div className='no-results-msg'>
            <p>You are not subscribed to any user profiles.</p>
            <p>Share your public profile with friends to let them subscribe.</p>
            <p>Visit the <Link as='/settings' href='/settings'><a onClick={this.linkClick}>Settings page</a></Link> to make your profile public.</p>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserListCtrl)
