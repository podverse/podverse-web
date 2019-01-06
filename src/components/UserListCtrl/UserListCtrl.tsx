
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { PVButton as Button } from 'podverse-ui'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import { getPublicUsersByQuery } from '~/services'
import Link from 'next/link';
const uuidv4 = require('uuid/v4')

type Props = {
  listItems?: any[]
  queryPage?: number
  user?: any
}

type State = {
  endReached?: boolean
  isLoadingMore?: boolean
  listItems: any[]
  queryPage: number
}

class UserListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    listItems: [],
    queryPage: 1
  }

  constructor(props) {
    super(props)

    this.state = {
      listItems: props.listItems || [],
      queryPage: props.queryPage
    }

    this.queryUserListItems = this.queryUserListItems.bind(this)
  }

  async queryUserListItems(page = 1) {
    const { user } = this.props
    const { listItems } = this.state

    let query: any = { page }

    this.setState({
      isLoadingMore: true,
      queryPage: page
    })

    let combinedListItems: any = []

    if (page > 1) {
      combinedListItems = listItems
    }

    try {
      query.userIds = user.subscribedUserIds

      const response = await getPublicUsersByQuery(query)
      const users = response.data
      combinedListItems = combinedListItems.concat(users)

      this.setState({
        endReached: users.length === 0,
        isLoadingMore: false,
        listItems: page > 1 ? combinedListItems : users
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoadingMore: false })
    }
  }

  render() {
    const { endReached, isLoadingMore, listItems, queryPage } = this.state

    const listItemNodes = listItems.map(x => {
      return (
        <MediaListItemCtrl
          key={`media-list-item-${uuidv4()}`}
          mediaListItemType='user'
          profileUser={x} />
      )
    })

    return (
      <div className='media-list adjust-top-position'>
        {
          listItemNodes && listItemNodes.length > 0 &&
          <Fragment>
            {listItemNodes}
            <div className='media-list__load-more'>
              {
                endReached ?
                  <p>End of results</p>
                  : <Button
                    className='media-list-load-more__button'
                    isLoading={isLoadingMore}
                    onClick={() => this.queryUserListItems(queryPage + 1)}
                    text='Load More' />
              }
            </div>
          </Fragment>
        }
        {
          (!endReached && listItemNodes.length === 0) &&
          <div className='no-results-msg'>
            <p>You are not subscribed to any user profiles.</p>
            <p>Share links to your public profile with friends to let them subscribe.</p>
            <p>Visit the <Link as='/settings' href='/settings'><a>Settings page</a></Link> to make your profile public.</p>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(UserListCtrl)
