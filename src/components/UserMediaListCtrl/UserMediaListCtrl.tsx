
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { MediaListSelect, PVButton as Button } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  handleSetPageQueryState: Function
  isMyProfilePage?: boolean
  loggedInUser?: any
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  pageKey: string
  pages?: any
  playerQueueAddSecondaryItems?: any
  playerQueueLoadSecondaryItems?: any
  profileUser?: any
  queryPage: number
  querySort?: string
  queryType?: string
  settings?: any
  userSetInfo?: any
}

type State = {}

class UserMediaListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    handleSetPageQueryState: () => { },
    pageKey: 'default',
    queryPage: 1
  }

  constructor(props) {
    super(props)

    this.playItem = this.playItem.bind(this)
    this.queryMediaListItems = this.queryMediaListItems.bind(this)
  }

  async queryMediaListItems(selectedKey = '', selectedValue = '', page = 1) {
    const { handleSetPageQueryState, isMyProfilePage, pages, pageKey,
      playerQueueAddSecondaryItems, playerQueueLoadSecondaryItems, profileUser,
      settings } = this.props
    const { nsfwMode } = settings
    const { listItems, querySort, queryType } = pages[pageKey]

    let query: any = {
      page,
      sort: querySort,
      type: queryType
    }

    if (page > 1) {
      handleSetPageQueryState({
        pageKey,
        isLoadingMore: true
      })
    }

    let newState: any = { 
      pageKey,
      queryPage: page
    }

    if (selectedKey === 'type') {
      newState.queryType = selectedValue
      query.type = selectedValue
    } else if (selectedKey === 'sort') {
      newState.querySort = selectedValue
      query.sort = selectedValue
    }

    if (['type', 'sort'].includes(selectedKey)) {
      newState.isLoadingInitial = true
    }

    handleSetPageQueryState(newState)
    
    let combinedListItems: any = []

    if (page > 1) {
      combinedListItems = listItems
    }

    if (queryType === 'podcasts' 
        && profileUser.subscribedPodcastIds
        && profileUser.subscribedPodcastIds.length > 0) {
      try {
        query.subscribedPodcastIds = profileUser.subscribedPodcastIds
        query.from = 'subscribed-only'
        const response = await getPodcastsByQuery(query, nsfwMode)
        const podcasts = response.data
        combinedListItems = combinedListItems.concat(podcasts)

        handleSetPageQueryState({
          pageKey,
          endReached: podcasts.length < 2,
          isLoadingInitial: false,
          isLoadingMore: false,
          listItems: page > 1 ? combinedListItems : podcasts
        })
      } catch (error) {
        console.log(error)
        handleSetPageQueryState({
          pageKey,
          isLoadingInitial: false,
          isLoadingMore: false
        })
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

        handleSetPageQueryState({
          pageKey,
          endReached: mediaRefs.length < 2,
          isLoadingInitial: false,
          isLoadingMore: false,
          listItems: page > 1 ? combinedListItems : mediaRefs
        })
      } catch (error) {
        console.log(error)
        handleSetPageQueryState({
          pageKey,
          isLoadingInitial: false,
          isLoadingMore: false
        })
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

        handleSetPageQueryState({
          pageKey,
          endReached: playlists.length < 2,
          isLoadingInitial: false,
          isLoadingMore: false,
          listItems: page > 1 ? combinedListItems : playlists
        })
      } catch (error) {
        console.log(error)
        handleSetPageQueryState({
          pageKey,
          isLoadingInitial: false,
          isLoadingMore: false
        })
      }
    } else {
      handleSetPageQueryState({
        pageKey,
        endReached: true,
        isLoadingInitial: false,
        isLoadingMore: false,
        listItems: []
      })
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
      pages, pageKey, playerQueueLoadSecondaryItems, userSetInfo } = this.props
    const { listItems } = pages[pageKey]

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
    const { adjustTopPosition, mediaPlayer, pages, pageKey, profileUser
      } = this.props
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { endReached, isLoadingInitial, isLoadingMore, listItems,
      queryPage, querySort, queryType } = pages[pageKey]
    const username = `${profileUser.name || 'This person'}`
    
    let mediaListItemType = 'now-playing-item'
    let noResultsMsg = ''
    if (queryType === 'clips') {
      mediaListItemType = 'now-playing-item'
      noResultsMsg = `No results`
    } else if (queryType === 'playlists') {
      mediaListItemType = 'playlist'
      noResultsMsg = `No results`
    } else if (queryType === 'podcasts') {
      mediaListItemType = 'podcast'
      noResultsMsg = `${username} is not subscribed to any podcasts`
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
          {
            queryType !== 'playlists' &&
              <div className='media-list-selects__right'>
                <MediaListSelect
                  className='align-right'
                  items={this.getQuerySortOptions()}
                  selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
              </div>
          }
        </div>
        {
          isLoadingInitial &&
            <div className='media-list__loader'>
              <FontAwesomeIcon icon='spinner' spin />
            </div>
        }
        {
          !isLoadingInitial &&
            <Fragment>
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
                            isLoading={isLoadingMore}
                            onClick={() => this.queryMediaListItems('', '', queryPage + 1)}
                            text='Load More' />
                    }
                  </div>
                </Fragment>
              }
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
