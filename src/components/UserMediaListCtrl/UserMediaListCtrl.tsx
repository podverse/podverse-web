
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { MediaListSelect, Pagination, setNowPlayingItemInStorage } from 'podverse-ui'
import { bindActionCreators } from 'redux'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import config from '~/config'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { assignLocalOrLoggedInNowPlayingItemPlaybackPosition, clone } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, pageIsLoading, 
  playerQueueAddSecondaryItems, playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems,
  userSetInfo } from '~/redux/actions'
import { addOrUpdateUserHistoryItem, getPodcastsByQuery, getUserMediaRefs, getUserPlaylists,
  getLoggedInUserMediaRefs, getLoggedInUserPlaylists } from '~/services'
const uuidv4 = require('uuid/v4')
const { QUERY_MEDIA_REFS_LIMIT } = config()

type Props = {
  adjustTopPosition?: boolean
  currentId?: string
  handleSetPageQueryState: Function
  isMyProfilePage?: boolean
  loggedInUser?: any
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  pageIsLoading?: any
  pageKey?: string
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

  queryMediaListItems = async (selectedKey = '', selectedValue = '', page = 1) => {
    const { handleSetPageQueryState, isMyProfilePage, pageIsLoading, pages, pageKey,
      playerQueueAddSecondaryItems, playerQueueLoadSecondaryItems, profileUser,
      settings } = this.props
    const { nsfwMode } = settings
    const { querySort, queryType } = pages[pageKey]

    pageIsLoading(true)

    let query: any = {
      page,
      sort: querySort,
      type: queryType
    }

    let newState: any = {
      listItems: [],
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

    handleSetPageQueryState(newState)
    
    if (query.type === 'podcasts' 
        && profileUser.subscribedPodcastIds
        && profileUser.subscribedPodcastIds.length > 0) {
      try {
        query.subscribedPodcastIds = profileUser.subscribedPodcastIds
        query.from = 'subscribed-only'
        const response = await getPodcastsByQuery(query, isMyProfilePage ? 'on' : nsfwMode)
        const podcasts = response.data

        handleSetPageQueryState({
          pageKey,
          listItems: podcasts[0],
          listItemsTotal: podcasts[1]
        })
      } catch (error) {
        console.log(error)
      }
    } else if (query.type === 'clips') {
      try {
        let response: any = {}
        if (isMyProfilePage) {
          response = await getLoggedInUserMediaRefs(
            '',
            nsfwMode,
            query.sort === 'alphabetical' ? 'most-recent' : query.sort,
            page
          )
        } else {
          response = await getUserMediaRefs(
            profileUser.id,
            nsfwMode,
            query.sort === 'alphabetical' ? 'most-recent' : query.sort,
            page
          )
        }

        const mediaRefs = response.data
        const nowPlayingItems = mediaRefs[0].map(x => convertToNowPlayingItem(x))
        
        if (page > 1) {
          playerQueueAddSecondaryItems(clone(nowPlayingItems))
        } else {
          playerQueueLoadSecondaryItems(clone(nowPlayingItems))
        }

        handleSetPageQueryState({
          pageKey,
          listItems: nowPlayingItems,
          listItemsTotal: mediaRefs[1]
        })
      } catch (error) {
        console.log(error)
      }
    } else if (query.type === 'playlists') {
      try {
        let response: any = {}

        if (isMyProfilePage) {
          response = await getLoggedInUserPlaylists('', page)
        } else {
          response = await getUserPlaylists(profileUser.id, nsfwMode, page)
        }
        const playlists = response.data

        handleSetPageQueryState({
          pageKey,
          listItems: playlists[0],
          listItemsTotal: playlists[1]
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      handleSetPageQueryState({
        pageKey,
        listItems: [],
        listItemsTotal: 0
      })
    }

    pageIsLoading(false)
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

  getQuerySortOptions(isPodcasts) {
    let items = [
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

    if (isPodcasts) {
      items.unshift({
        label: 'alphabetical',
        onClick: () => this.queryMediaListItems('sort', 'alphabetical'),
        value: 'alphabetical'
      })
    }

    return items
  }

  playItem = async nowPlayingItem => {
    const { loggedInUser, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      pages, pageKey, playerQueueLoadSecondaryItems, user, userSetInfo } = this.props
    const { listItems } = pages[pageKey]

    nowPlayingItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, nowPlayingItem)
    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    setNowPlayingItemInStorage(nowPlayingItem)
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

  handleQueryPage = async page => {
    await this.queryMediaListItems('', '', page)

    const viewContentsEl = document.querySelector('.view__contents')
    if (viewContentsEl) {
      viewContentsEl.scrollTop = 0
    }
  }

  render() {
    const { adjustTopPosition, mediaPlayer, page, pages, pageKey } = this.props
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { listItems, listItemsTotal, queryPage, querySort, queryType } = pages[pageKey]
    
    let mediaListItemType = 'now-playing-item'
    let noResultsMsg = ''
    if (queryType === 'clips') {
      mediaListItemType = 'now-playing-item'
      noResultsMsg = `No clips found`
    } else if (queryType === 'playlists') {
      mediaListItemType = 'playlist'
      noResultsMsg = `No playlists found`
    } else if (queryType === 'podcasts') {
      mediaListItemType = 'podcast'
      noResultsMsg = `No subscribed podcasts found`
    }

    const listItemNodes = Array.isArray(listItems) ? listItems.map(x => {
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
          hideDescription
          isActive={isActive()}
          key={`media-list-item-${uuidv4()}`}
          mediaListItemType={mediaListItemType}
          nowPlayingItem={queryType === 'clips' ? x : null}
          pageKey={pageKey}
          playlist={queryType === 'playlists' ? x : null}
          podcast={queryType === 'podcasts' ? x : null}
          showMoreMenu={queryType === 'clips'} />
      )
    }) : []

    const selectedQueryTypeOption = this.getQueryTypeOptions().filter(x => x.value === queryType)
    const selectedQuerySortOption = this.getQuerySortOptions(queryType === 'podcasts').filter(x => x.value === querySort)

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
                  items={this.getQuerySortOptions(queryType === 'podcasts')}
                  selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
              </div>
          }
        </div>
        <Fragment>
          {
            listItemNodes && listItemNodes.length > 0 &&
            <div className={queryType === 'playlists' ? 'reduced-margin' : ''}>
              {listItemNodes}
              <Pagination
                currentPage={queryPage || 1}
                handleQueryPage={this.handleQueryPage}
                pageRange={2}
                totalPages={Math.ceil(listItemsTotal / QUERY_MEDIA_REFS_LIMIT)} />
            </div>
          }
        </Fragment> 
        {
          !page.isLoading && listItemNodes.length === 0 &&
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
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  playerQueueAddSecondaryItems: bindActionCreators(playerQueueAddSecondaryItems, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMediaListCtrl)
