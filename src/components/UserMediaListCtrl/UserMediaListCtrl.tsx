
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { MediaListSelect, PVButton as Button } from 'podverse-ui'
import { bindActionCreators } from 'redux'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, 
  playerQueueAddSecondaryItems, playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems,
  userSetInfo } from '~/redux/actions'
import { addOrUpdateUserHistoryItem, getPodcastsByQuery, getUserMediaRefs, getUserPlaylists,
  getLoggedInUserMediaRefs, getLoggedInUserPlaylists } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  adjustTopPosition?: boolean
  currentId?: string
  isMyProfilePage?: boolean
  listItems: any[]
  loggedInUser?: any
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  playerQueueAddSecondaryItems?: any
  playerQueueLoadSecondaryItems?: any
  profileUser?: any
  queryPage: number
  querySort?: string
  queryType?: string
  settings?: any
  userSetInfo?: any
}

type State = {
  currentId?: string
  endReached?: boolean
  isLoadingMore?: boolean
  listItems: any[]
  queryPage: number
  querySort?: string
  queryType?: string
}

class UserMediaListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    listItems: [],
    queryPage: 1,
    querySort: 'top-past-week',
    queryType: 'clips'
  }

  constructor(props) {
    super(props)

    this.state = {
      currentId: props.currentId,
      endReached: props.listItems && props.listItems.length > 0 && props.listItems.length < 2,
      listItems: props.listItems || [],
      queryPage: props.queryPage,
      querySort: props.querySort,
      queryType: props.queryType
    }

    this.playItem = this.playItem.bind(this)
    this.queryMediaListItems = this.queryMediaListItems.bind(this)
  }

  static getDerivedStateFromProps(props, current_state) {
    if (props.currentId !== current_state.currentId) {
      return {
        currentId: props.currentId,
        listItems: props.listItems || [],
        queryPage: props.queryPage,
        querySort: props.querySort,
        queryType: props.queryType
      }
    }

    return null
  }

  async queryMediaListItems(selectedKey = '', selectedValue = '', page = 1) {
    const { isMyProfilePage, playerQueueAddSecondaryItems, playerQueueLoadSecondaryItems,
      profileUser, settings } = this.props
    const { nsfwMode } = settings
    const { listItems, querySort, queryType } = this.state

    let query: any = {
      id: '',
      page,
      sort: querySort,
      type: queryType
    }

    this.setState({ isLoadingMore: true })

    let newState: any = { queryPage: page }

    if (selectedKey === 'type') {
      newState.queryType = selectedValue
      query.type = selectedValue
    } else if (selectedKey === 'sort') {
      newState.querySort = selectedValue
      query.sort = selectedValue
    }

    this.setState(newState)
    
    let combinedListItems: any = []

    if (page > 1) {
      combinedListItems = listItems
    }

    if (query.type === 'podcasts') {
      try {
        query.subscribedPodcastIds = profileUser.subscribedPodcastIds
        query.from = 'subscribed-only'
        const response = await getPodcastsByQuery(query, nsfwMode)
        const podcasts = response.data
        combinedListItems = combinedListItems.concat(podcasts)

        this.setState({
          endReached: podcasts.length < 2,
          isLoadingMore: false,
          listItems: page > 1 ? combinedListItems : podcasts
        })
      } catch (error) {
        console.log(error)
        this.setState({ isLoadingMore: false })
      }
    } else if (query.type === 'clips') {
      try {
        let response: any = {}
        if (isMyProfilePage) {
          response = await getLoggedInUserMediaRefs(
            '',
            nsfwMode,
            query.sort,
            page
          )
        } else {
          response = await getUserMediaRefs(
            profileUser.id,
            nsfwMode,
            query.sort,
            page
          )
        }
        const mediaRefs = response.data && response.data.map(x => convertToNowPlayingItem(x))
        combinedListItems = combinedListItems.concat(mediaRefs)
        
        if (page > 1) {
          playerQueueAddSecondaryItems(clone(mediaRefs))
        } else {
          playerQueueLoadSecondaryItems(clone(mediaRefs))
        }

        this.setState({
          endReached: mediaRefs.length < 2,
          isLoadingMore: false,
          listItems: page > 1 ? combinedListItems : mediaRefs
        })
      } catch (error) {
        console.log(error)
        this.setState({ isLoadingMore: false })
      }
    } else if (query.type === 'playlists') {
      try {
        let response: any = {}
        if (isMyProfilePage) {
          response = await getLoggedInUserPlaylists('', query.sort, page)
        } else {
          response = await getUserPlaylists(profileUser.id, nsfwMode, page)
        }
        const playlists = response.data
        combinedListItems = combinedListItems.concat(playlists)

        this.setState({
          endReached: playlists.length < 2,
          isLoadingMore: false,
          listItems: page > 1 ? combinedListItems : playlists
        })
      } catch (error) {
        console.log(error)
        this.setState({ isLoadingMore: false })
      }

    }
  }

  getQueryTypeOptions() {
    return [
      {
        label: 'Podcasts',
        onClick: () => this.queryMediaListItems('type', 'podcasts'),
        value: 'podcasts',
      },
      {
        label: 'Clips',
        onClick: () => this.queryMediaListItems('type', 'clips'),
        value: 'clips',
      },
      {
        label: 'Playlists',
        onClick: () => this.queryMediaListItems('type', 'playlists'),
        value: 'playlists'
      }
    ]
  }

  getQuerySortOptions() {
    return [
      {
        label: 'alphabetical',
        onClick: () => this.queryMediaListItems('sort', 'alphabetical'),
        value: 'alphabetical'
      },
      {
        label: 'most recent',
        onClick: () => this.queryMediaListItems('sort', 'most-recent'),
        value: 'most-recent'
      },
      {
        label: 'top - past hour',
        onClick: () => this.queryMediaListItems('sort', 'top-past-hour'),
        value: 'top-past-hour'
      },
      {
        label: 'top - past day',
        onClick: () => this.queryMediaListItems('sort', 'top-past-day'),
        value: 'top-past-day'
      },
      {
        label: 'top - past week',
        onClick: () => this.queryMediaListItems('sort', 'top-past-week'),
        value: 'top-past-week'
      },
      {
        label: 'top - past month',
        onClick: () => this.queryMediaListItems('sort', 'top-past-month'),
        value: 'top-past-month'
      },
      {
        label: 'top - past year',
        onClick: () => this.queryMediaListItems('sort', 'top-past-year'),
        value: 'top-past-year'
      },
      {
        label: 'top - all time',
        onClick: () => this.queryMediaListItems('sort', 'top-all-time'),
        value: 'top-all-time'
      }
    ]
  }

  async playItem(nowPlayingItem) {
    const { loggedInUser, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      playerQueueLoadSecondaryItems, userSetInfo } = this.props
    const { listItems } = this.state

    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    mediaPlayerUpdatePlaying(true)

    let nowPlayingItemIndex = -1
    if (nowPlayingItem.clipId) {
      nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    }
    let queuedListItems = clone(listItems)
    nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems
    playerQueueLoadSecondaryItems(queuedListItems)

    if (loggedInUser && loggedInUser.id) {
      await addOrUpdateUserHistoryItem(nowPlayingItem)

      const historyItems = loggedInUser.historyItems.filter(x => {
        if (x) {
          if ((x.clipStartTime || x.clipEndTime) && x.clipId !== nowPlayingItem.clipId) {
            return x
          }
        }
      })

      historyItems.push(nowPlayingItem)

      userSetInfo({ historyItems })
    }
  }

  render() {
    const { adjustTopPosition, mediaPlayer } = this.props
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { endReached, isLoadingMore, listItems, queryPage, querySort, queryType
      } = this.state

    let mediaListItemType = 'now-playing-item'
    let noResultsMsg = ''
    if (queryType === 'clips') {
      mediaListItemType = 'now-playing-item'
      noResultsMsg = 'This person has not created public clips.'
    } else if (queryType === 'playlists') {
      mediaListItemType = 'playlist'
      noResultsMsg = 'This person has not created public playlists.'
    } else if (queryType === 'podcasts') {
      mediaListItemType = 'podcast'
      noResultsMsg = 'This person is not subscribed to any podcasts.'
    }

    const listItemNodes = listItems.map(x => {
      const isActive = () => {
        if (mpNowPlayingItem && queryType === 'clips') {
          if (x.clipId) {
            return x.clipId === mpNowPlayingItem.clipId
          }
        }

        return false
      }

      return (
        <MediaListItemCtrl
          handlePlayItem={this.playItem}
          key={`media-list-item-${uuidv4()}`}
          isActive={isActive()}
          mediaListItemType={mediaListItemType}
          nowPlayingItem={queryType === 'clips' ? x : null}
          playlist={queryType === 'playlists' ? x : null}
          showMoreMenu={queryType === 'clips'}
          podcast={queryType === 'podcasts' ? x : null} />
      )
    })

    const selectedQueryTypeOption = this.getQueryTypeOptions().filter(x => x.value === queryType)
    const selectedQuerySortOption = this.getQuerySortOptions().filter(x => x.value === querySort)

    return (      
      <div className={`media-list ${adjustTopPosition ? 'adjust-top-position' : ''}`}>
        <div className='media-list__selects'>
          <div className='media-list-selects__left'>
            <MediaListSelect
              items={this.getQueryTypeOptions()}
              selected={selectedQueryTypeOption.length > 0 ? selectedQueryTypeOption[0].value : null} />
          </div>
          <div className='media-list-selects__right'>
            <MediaListSelect
              className='align-right'
              items={this.getQuerySortOptions()}
              selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
          </div>
        </div>
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
                    onClick={() => this.queryMediaListItems('', '', queryPage + 1)}
                    text='Load More' />
              }
            </div>
          </Fragment>
        }
        {
          listItemNodes.length === 0 &&
          <div className='no-results-msg'>{noResultsMsg}</div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  playerQueueAddSecondaryItems: bindActionCreators(playerQueueAddSecondaryItems, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMediaListCtrl)
