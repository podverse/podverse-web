
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { MediaListSelect, Pagination, setNowPlayingItemInStorage } from 'podverse-ui'
import { bindActionCreators } from 'redux'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import config from '~/config'
import PV from '~/lib/constants'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { addOrUpdateHistoryItemPlaybackPosition, assignLocalOrLoggedInNowPlayingItemPlaybackPosition,
  clone } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, pageIsLoading, 
  playerQueueAddSecondaryItems, playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems,
  userSetInfo } from '~/redux/actions'
import { getLoggedInUserMediaRefs, getLoggedInUserPlaylists, getPodcastsByQuery, getUserMediaRefs,
  getUserPlaylists } from '~/services'
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
  page?: any
  pageIsLoading?: any
  pageKey: string
  pages?: any
  playerQueueAddSecondaryItems?: any
  playerQueueLoadSecondaryItems?: any
  profileUser?: any
  queryPage: number
  querySort?: string
  queryType?: string
  settings?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class UserMediaListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    handleSetPageQueryState: () => { },
    pageKey: 'default',
    queryPage: 1
  }

  componentDidMount() {
    const { pages, pageKey } = this.props
    const { queryType } = pages[pageKey]
    this.queryMediaListItems('type', queryType)
  }

  queryMediaListItems = async (selectedKey = '', selectedValue = '', page = 1) => {
    const { handleSetPageQueryState, isMyProfilePage, pageIsLoading, pages, pageKey,
      playerQueueAddSecondaryItems, playerQueueLoadSecondaryItems, profileUser,
      settings } = this.props
    const { nsfwMode } = settings
    const { queryPage: prevPage, querySort, queryType } = pages[pageKey]

    pageIsLoading(true)

    const query: any = {
      page,
      sort: querySort,
      type: queryType
    }

    const newState: any = {
      listItems: [],
      pageKey,
      queryPage: page
    }

    if (selectedKey === PV.query.key.type) {
      newState.queryType = selectedValue
      query.type = selectedValue
    } else if (selectedKey === PV.query.key.sort) {
      newState.querySort = selectedValue
      query.sort = selectedValue
    } else {
      newState.queryType = queryType
      newState.querySort = querySort
    }

    handleSetPageQueryState({
      ...newState,
      queryPage: prevPage // wait before updating queryPage
    })
    
    if (query.type === PV.query.podcasts 
        && profileUser.subscribedPodcastIds
        && profileUser.subscribedPodcastIds.length > 0) {
      try {
        query.subscribedPodcastIds = profileUser.subscribedPodcastIds
        query.from = PV.query.subscribed_only
        const response = await getPodcastsByQuery(query)
        const podcasts = response.data

        handleSetPageQueryState({
          ...newState,
          pageKey,
          listItems: podcasts[0],
          listItemsTotal: podcasts[1]
        })
      } catch (error) {
        console.log(error)
      }
    } else if (query.type === PV.query.clips) {
      try {
        let response: any = {}
        if (isMyProfilePage) {
          response = await getLoggedInUserMediaRefs(
            '',
            nsfwMode,
            query.sort === PV.query.alphabetical ? PV.query.most_recent : query.sort,
            page
          )
        } else {
          response = await getUserMediaRefs(
            profileUser.id,
            nsfwMode,
            query.sort === PV.query.alphabetical ? PV.query.most_recent : query.sort,
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
          ...newState,
          pageKey,
          listItems: nowPlayingItems,
          listItemsTotal: mediaRefs[1]
        })
      } catch (error) {
        console.log(error)
      }
    } else if (query.type === PV.query.playlists) {
      try {
        let response: any = {}

        if (isMyProfilePage) {
          response = await getLoggedInUserPlaylists('', page)
        } else {
          response = await getUserPlaylists(profileUser.id, nsfwMode, page)
        }
        const playlists = response.data

        handleSetPageQueryState({
          ...newState,
          pageKey,
          listItems: playlists[0],
          listItemsTotal: playlists[1]
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      handleSetPageQueryState({
        ...newState,
        pageKey,
        listItems: [],
        listItemsTotal: 0
      })
    }

    pageIsLoading(false)
  }

  getQueryTypeOptions() {
    const { isMyProfilePage } = this.props
    return [
      {
        label: isMyProfilePage ? PV.core.MyPodcasts : PV.core.Podcasts,
        onClick: () => this.queryMediaListItems(PV.query.key.type, PV.query.podcasts),
        value: PV.query.podcasts,
      },
      {
        label: isMyProfilePage ? PV.core.MyClips : PV.core.Clips,
        onClick: () => this.queryMediaListItems(PV.query.key.type, PV.query.clips),
        value: PV.query.clips,
      },
      {
        label: isMyProfilePage ? PV.core.MyPlaylists : PV.core.Playlists,
        onClick: () => this.queryMediaListItems(PV.query.key.type, PV.query.playlists),
        value: PV.query.playlists
      }
    ]
  }

  getQuerySortOptions(isPodcasts) {
    const items = [
      {
        label: PV.query.label.most_recent,
        onClick: () => this.queryMediaListItems(PV.query.key.sort, PV.query.most_recent),
        value: PV.query.most_recent
      },
      {
        label: PV.query.label.top_past_day,
        onClick: () => this.queryMediaListItems(PV.query.key.sort, PV.query.top_past_day),
        value: PV.query.top_past_day
      },
      {
        label: PV.query.label.top_past_week,
        onClick: () => this.queryMediaListItems(PV.query.key.sort, PV.query.top_past_week),
        value: PV.query.top_past_week
      },
      {
        label: PV.query.label.top_past_month,
        onClick: () => this.queryMediaListItems(PV.query.key.sort, PV.query.top_past_month),
        value: PV.query.top_past_month
      },
      {
        label: PV.query.label.top_past_year,
        onClick: () => this.queryMediaListItems(PV.query.key.sort, PV.query.top_past_year),
        value: PV.query.top_past_year
      },
      {
        label: PV.query.label.top_all_time,
        onClick: () => this.queryMediaListItems(PV.query.key.sort, PV.query.top_all_time),
        value: PV.query.top_all_time
      },
      {
        label: PV.query.label.random,
        onClick: () => this.queryMediaListItems(PV.query.random),
        value: PV.query.random
      }
    ]

    if (isPodcasts) {
      items.unshift({
        label: PV.query.label.alphabetical,
        onClick: () => this.queryMediaListItems(PV.query.key.sort, PV.query.alphabetical),
        value: PV.query.alphabetical
      })
    }

    return items
  }

  playItem = async nowPlayingItem => {
    const { loggedInUser, mediaPlayer, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      pages, pageKey, playerQueueLoadSecondaryItems, user, userSetInfo } = this.props
    const { listItems } = pages[pageKey]

    if (window.player) {
      const currentTime = Math.floor(window.player.getCurrentTime()) || 0
      await addOrUpdateHistoryItemPlaybackPosition(mediaPlayer.nowPlayingItem, user, currentTime)
    }

    nowPlayingItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, nowPlayingItem)
    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    setNowPlayingItemInStorage(nowPlayingItem)
    mediaPlayerUpdatePlaying(true)

    let nowPlayingItemIndex = -1
    if (nowPlayingItem.clipId) {
      nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    }
    const queuedListItems = clone(listItems)
    if (nowPlayingItemIndex > -1) queuedListItems.splice(0, nowPlayingItemIndex + 1)
    playerQueueLoadSecondaryItems(queuedListItems)

    if (loggedInUser && loggedInUser.id) {
      await addOrUpdateHistoryItemPlaybackPosition(nowPlayingItem, user)

      const historyItems = loggedInUser.historyItems.filter(x => {
        if (x) {
          if ((x.clipStartTime || x.clipStartTime === 0 || x.clipEndTime) && x.clipId !== nowPlayingItem.clipId) {
            return x
          }
        }
        return null
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
    
    let mediaListItemType = PV.mediaList.now_playing_item
    let noResultsMsg = ''
    if (queryType === PV.query.clips) {
      noResultsMsg = PV.core.noResultsMessage(PV.core.clips)
    } else if (queryType === PV.query.playlists) {
      mediaListItemType = PV.query.playlist
      noResultsMsg = PV.core.noResultsMessage(PV.core.playlists)
    } else if (queryType === PV.query.podcasts) {
      mediaListItemType = PV.query.podcast
      noResultsMsg = PV.core.noResultsMessage(PV.core.podcasts)
    }

    const listItemNodes = Array.isArray(listItems) ? listItems.map(x => {
      const isActive = () => {
        if (mpNowPlayingItem && queryType === PV.query.clips) {
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
          nowPlayingItem={queryType === PV.query.clips ? x : null}
          pageKey={pageKey}
          playlist={queryType === PV.query.playlists ? x : null}
          podcast={queryType === PV.query.podcasts ? x : null}
          showMoreMenu={queryType === PV.query.clips} />
      )
    }) : []

    const selectedQueryTypeOption = this.getQueryTypeOptions().filter(x => x.value === queryType)
    const selectedQuerySortOption = this.getQuerySortOptions(queryType === PV.query.podcasts).filter(x => x.value === querySort)

    return (      
      <div className={`media-list ${adjustTopPosition ? 'adjust-top-position' : ''}`}>
        <div className='media-list__selects'>
          <div className='media-list-selects__left'>
            <MediaListSelect
              items={this.getQueryTypeOptions()}
              selected={selectedQueryTypeOption.length > 0 ? selectedQueryTypeOption[0].value : null} />
          </div>
          {
            queryType !== PV.query.playlists &&
              <div className='media-list-selects__right'>
                <MediaListSelect
                  className='align-right'
                  items={this.getQuerySortOptions(queryType === PV.query.podcasts)}
                  selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
              </div>
          }
        </div>
        <Fragment>
          {
            listItemNodes && listItemNodes.length > 0 &&
              <div className={queryType === PV.query.playlists ? 'reduced-margin' : ''}>
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
