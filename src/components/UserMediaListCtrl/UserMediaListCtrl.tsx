import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { convertToNowPlayingItem } from 'podverse-shared'
import { MediaListSelect, Pagination } from 'podverse-ui'
import { bindActionCreators } from 'redux'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import config from '~/config'
import PV from '~/lib/constants'
import { addOrUpdateHistoryItemAndState } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, pageIsLoading, 
  playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { getLoggedInUserMediaRefsFromFrontEnd, getLoggedInUserPlaylistsFromFrontEnd,
  getPodcastsByQuery, getUserMediaRefs, getUserPlaylists, setNowPlayingItem } from '~/services'
import { withTranslation } from '~/../i18n'
const uuidv4 = require('uuid/v4')
const { QUERY_MEDIA_REFS_LIMIT } = config()

type Props = {
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
  profileUser?: any
  settings?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class UserMediaListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    handleSetPageQueryState: () => { },
    pageKey: 'default'
  }

  queryMediaListItems = async (selectedKey = '', selectedValue = '', page = 1) => {
    const { handleSetPageQueryState, isMyProfilePage, pageIsLoading, pages, pageKey,
      profileUser } = this.props
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

    if (selectedKey === PV.queryParams.key.type) {
      newState.queryType = selectedValue
      query.type = selectedValue
    } else if (selectedKey === PV.queryParams.key.sort) {
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
    
    if (query.type === PV.queryParams.podcasts 
        && profileUser.subscribedPodcastIds
        && profileUser.subscribedPodcastIds.length > 0) {
      try {
        query.subscribedPodcastIds = profileUser.subscribedPodcastIds
        query.from = PV.queryParams.subscribed_only
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
    } else if (query.type === PV.queryParams.clips) {
      try {
        let response: any = {}
        if (isMyProfilePage) {
          response = await getLoggedInUserMediaRefsFromFrontEnd(
            query.sort === PV.queryParams.alphabetical ? PV.queryParams.most_recent : query.sort,
            page
          )
        } else {
          response = await getUserMediaRefs(
            profileUser.id,
            query.sort === PV.queryParams.alphabetical ? PV.queryParams.most_recent : query.sort,
            page
          )
        }

        const mediaRefs = response.data
        const nowPlayingItems = mediaRefs[0].map(x => convertToNowPlayingItem(x))
        
        handleSetPageQueryState({
          ...newState,
          pageKey,
          listItems: nowPlayingItems,
          listItemsTotal: mediaRefs[1]
        })
      } catch (error) {
        console.log(error)
      }
    } else if (query.type === PV.queryParams.playlists) {
      try {
        let response: any = {}

        if (isMyProfilePage) {
          response = await getLoggedInUserPlaylistsFromFrontEnd(page)
        } else {
          response = await getUserPlaylists(profileUser.id, page)
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
    const { isMyProfilePage, t } = this.props
    return [
      {
        label: isMyProfilePage ? t('MyPodcasts') : t('Podcasts'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.type, PV.queryParams.podcasts),
        value: PV.queryParams.podcasts,
      },
      {
        label: isMyProfilePage ? t('MyClips') : t('Clips'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.type, PV.queryParams.clips),
        value: PV.queryParams.clips,
      },
      {
        label: isMyProfilePage ? t('MyPlaylists') : t('Playlists'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.type, PV.queryParams.playlists),
        value: PV.queryParams.playlists
      }
    ]
  }

  getQuerySortOptions(isPodcasts) {
    const { t } = this.props

    const items = [
      {
        label: t('queryLabels:most_recent'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.sort, PV.queryParams.most_recent),
        value: PV.queryParams.most_recent
      },
      {
        label: t('queryLabels:top_past_day'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.sort, PV.queryParams.top_past_day),
        value: PV.queryParams.top_past_day
      },
      {
        label: t('queryLabels:top_past_week'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.sort, PV.queryParams.top_past_week),
        value: PV.queryParams.top_past_week
      },
      {
        label: t('queryLabels:top_past_month'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.sort, PV.queryParams.top_past_month),
        value: PV.queryParams.top_past_month
      },
      {
        label: t('queryLabels:top_past_year'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.sort, PV.queryParams.top_past_year),
        value: PV.queryParams.top_past_year
      },
      {
        label: t('queryLabels:top_all_time'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.sort, PV.queryParams.top_all_time),
        value: PV.queryParams.top_all_time
      },
      {
        label: t('queryLabels:random'),
        onClick: () => this.queryMediaListItems(PV.queryParams.random),
        value: PV.queryParams.random
      }
    ]

    if (isPodcasts) {
      items.unshift({
        label: t('queryLabels:alphabetical'),
        onClick: () => this.queryMediaListItems(PV.queryParams.key.sort, PV.queryParams.alphabetical),
        value: PV.queryParams.alphabetical
      })
    }

    return items
  }

  playItem = async nowPlayingItem => {
    const { loggedInUser, mediaPlayer, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      user, userSetInfo } = this.props

    if (window.player) {
      const currentTime = Math.floor(window.player.getCurrentTime()) || 0
      await addOrUpdateHistoryItemAndState(mediaPlayer.nowPlayingItem, user, currentTime)
    }

    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    await setNowPlayingItem(nowPlayingItem, nowPlayingItem.userPlaybackPosition, user)
    mediaPlayerUpdatePlaying(true)

    if (loggedInUser && loggedInUser.id) {
      await addOrUpdateHistoryItemAndState(nowPlayingItem, user)

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
    const { mediaPlayer, page, pages, pageKey, t } = this.props
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { listItems, listItemsTotal, queryPage, querySort, queryType } = pages[pageKey]
    
    let mediaListItemType = PV.attributes.mediaListItem.now_playing_item
    let noResultsMsg = ''
    if (queryType === PV.queryParams.clips) {
      noResultsMsg = t('No clips found')
    } else if (queryType === PV.queryParams.playlists) {
      mediaListItemType = PV.queryParams.playlist
      noResultsMsg = t('No playlists found')
    } else if (queryType === PV.queryParams.podcasts) {
      mediaListItemType = PV.queryParams.podcast
      noResultsMsg = t('No podcasts found')
    }

    const listItemNodes = Array.isArray(listItems) ? listItems.map(x => {
      const isActive = () => {
        if (mpNowPlayingItem && queryType === PV.queryParams.clips) {
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
          nowPlayingItem={queryType === PV.queryParams.clips ? x : null}
          pageKey={pageKey}
          playlist={queryType === PV.queryParams.playlists ? x : null}
          podcast={queryType === PV.queryParams.podcasts ? x : null}
          showMoreMenu={queryType === PV.queryParams.clips} />
      )
    }) : []

    const selectedQueryTypeOption = this.getQueryTypeOptions().filter(x => x.value === queryType)
    const selectedQuerySortOption = this.getQuerySortOptions(queryType === PV.queryParams.podcasts).filter(x => x.value === querySort)

    return (      
      <div className={`media-list`}>
        <div className='media-list__selects'>
          <div className='media-list-selects__left'>
            <MediaListSelect
              items={this.getQueryTypeOptions()}
              selected={selectedQueryTypeOption.length > 0 ? selectedQueryTypeOption[0].value : null} />
          </div>
          {
            queryType !== PV.queryParams.playlists &&
            <div className='media-list-selects__right'>
              <MediaListSelect
                className='align-right'
                items={this.getQuerySortOptions(queryType === PV.queryParams.podcasts)}
                selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
            </div>
          }
        </div>
        <Fragment>
          {
            listItemNodes && listItemNodes.length > 0 &&
            <div className={queryType === PV.queryParams.playlists ? 'reduced-margin' : ''}>
              {listItemNodes}
              <Pagination
                currentPage={queryPage || 1}
                handleQueryPage={this.handleQueryPage}
                pageRange={2}
                t={t}
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
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(UserMediaListCtrl))
