
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaListSelect, PVButton as Button } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, playerQueueAddSecondaryItems,
  playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems, userSetInfo
  } from '~/redux/actions'
import { addOrUpdateUserHistoryItem, getEpisodesByQuery, getMediaRefsByQuery
  } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  adjustTopPosition?: boolean
  currentId?: string
  episodeId?: string
  handleSetPageQueryState: Function
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  pageKey: string
  pages?: any
  playerQueueAddSecondaryItems?: any
  playerQueueLoadSecondaryItems?: any
  podcastId?: string
  queryFrom?: string
  queryPage: number
  querySort?: string
  queryType?: string
  settings?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class MediaListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    handleSetPageQueryState: () => {},
    pageKey: 'default',
    queryPage: 1
  }

  queryLoadInitial = () => {
    const { handleSetPageQueryState, pageKey } = this.props

    handleSetPageQueryState({
      pageKey,
      isLoadingInitial: true
    })
  }

  queryListItems = async (
    queryType,
    queryFrom,
    querySort,
    isLoadMore = false,
    isLastLoadMore = false) => {
    const { episodeId, handleSetPageQueryState, pageKey, pages,
      playerQueueLoadSecondaryItems, podcastId, settings, user } = this.props
    const { nsfwMode } = settings
    const { subscribedPodcastIds } = user
    const { listItems, queryPage } = pages[pageKey]
    
    if (!isLoadMore) {
      this.queryLoadInitial()
    }

    let query: any = {
      page: isLoadMore ? queryPage + 1 : 1,
      from: queryFrom,
      sort: querySort,
      episodeId: queryFrom === 'from-episode' ? episodeId : null,
      podcastId: queryFrom === 'from-podcast' ? podcastId : null,
      subscribedPodcastIds: queryFrom === 'subscribed-only' ? subscribedPodcastIds : null
    }

    let newState: any = {
      pageKey,
      queryPage: isLoadMore ? queryPage + 1 : 1,
      queryType,
      queryFrom,
      querySort
    }

    let combinedListItems = []
    if (isLoadMore) {
      combinedListItems = listItems
    }

    try {
      let endReached

      if (queryType === 'episodes') {
        let response = await getEpisodesByQuery(query, nsfwMode)
        const episodes = response.data && response.data.map(x => convertToNowPlayingItem(x))
        endReached = isLastLoadMore || episodes.length < 20
        combinedListItems = combinedListItems.concat(episodes)
      } else {
        let response = await getMediaRefsByQuery(query, nsfwMode)
        const mediaRefs = response.data && response.data.map(x => convertToNowPlayingItem(x))
        endReached = mediaRefs.length < 20
        combinedListItems = combinedListItems.concat(mediaRefs)
      }

      playerQueueLoadSecondaryItems(clone(combinedListItems))

      handleSetPageQueryState({
        ...newState,
        endReached,
        isLoadingInitial: false,
        isLoadingMore: false,
        listItems: combinedListItems
      })
    } catch (error) {
      console.log(error)
      handleSetPageQueryState({
        ...newState,
        endReached: false,
        isLoadingInitial: false,
        isLoadingMore: false,
        listItems: []
      })
    }
  }

  querySort = async selectedValue => {
    const { pageKey, pages } = this.props
    const { queryFrom, queryType } = pages[pageKey]

    this.queryLoadInitial()
        
    await this.queryListItems(queryType, queryFrom, selectedValue)
  }

  queryLoadMore = async () => {
    const { handleSetPageQueryState, pageKey, pages } = this.props
    const { queryFrom, querySort, queryType } = pages[pageKey]

    handleSetPageQueryState({
      pageKey,
      isLoadingMore: true
    })

    const isLastLoadMore = queryType === 'episodes' && queryFrom === 'from-podcast'

    await this.queryListItems(queryType, queryFrom, querySort, true, isLastLoadMore)
  }

  getQueryTypeOptions = () => {
    const { pageKey, pages, podcastId } = this.props
    const { queryFrom, querySort } = pages[pageKey]

    return [
      {
        label: 'Clips',
        onClick: () => this.queryListItems('clips', queryFrom, querySort),
        value: 'clips',
      },
      {
        label: 'Episodes',
        onClick: () => this.queryListItems(
          'episodes',
          podcastId ? 'from-podcast' : queryFrom,
          'most-recent'
        ),
        value: 'episodes',
      }
    ]
  }

  getQueryFromOptions = (showFromPodcast, showFromEpisode) => {
    const { pageKey, pages, user } = this.props
    const { querySort, queryType } = pages[pageKey]

    const options = [
      {
        label: 'All podcasts',
        onClick: () => this.queryListItems(queryType, 'all-podcasts', querySort),
        value: 'all-podcasts'
      },
      {
        label: 'Subscribed only',
        onClick: () => {
          if (user && user.id) {
            this.queryListItems(queryType, 'subscribed-only', querySort)
          } else {
            alert('Login to filter by your subscribed podcasts.')
          }
        },
        value: 'subscribed-only'
      }
    ]

    if (showFromPodcast) {
      options.push(
        {
          label: 'From this podcast',
          onClick: () => this.queryListItems(queryType, 'from-podcast', querySort),
          value: 'from-podcast'
        }
      )
    }

    if (showFromEpisode) {
      options.push(
        {
          label: 'From this episode',
          onClick: () => this.queryListItems(queryType, 'from-episode', querySort),
          value: 'from-episode'
        }
      )
    }

    return options
  }

  getQuerySortOptions() {
    return [
      {
        label: 'top - past hour',
        onClick: () => this.querySort('top-past-hour'),
        value: 'top-past-hour'
      },
      {
        label: 'top - past day',
        onClick: () => this.querySort('top-past-day'),
        value: 'top-past-day'
      },
      {
        label: 'top - past week',
        onClick: () => this.querySort('top-past-week'),
        value: 'top-past-week'
      },
      {
        label: 'top - past month',
        onClick: () => this.querySort('top-past-month'),
        value: 'top-past-month'
      },
      {
        label: 'top - past year',
        onClick: () => this.querySort('top-past-year'),
        value: 'top-past-year'
      },
      {
        label: 'top - all time',
        onClick: () => this.querySort('top-all-time'),
        value: 'top-all-time'
      },
      {
        label: 'most recent',
        onClick: () => this.querySort('most-recent'),
        value: 'most-recent'
      }
    ]
  }

  playItem = async nowPlayingItem => {
    const { mediaPlayer, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      pageKey, pages, playerQueueLoadSecondaryItems, user, userSetInfo } = this.props
    const { listItems } = pages[pageKey]
    const { nowPlayingItem: previousItem } = mediaPlayer

    // If loading a new episode, clear the player to prevent the error:
    // TypeError: Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided double value is non-finite.
    // I don't know why this is happening because everywhere I am setting player.seekTo
    // the value should be wrapped in a Math.floor().
    // I also don't understand why this issue happens only for new episodes, but not new clips :(
    if (nowPlayingItem 
        && previousItem 
        && !nowPlayingItem.clipStartTime
        && nowPlayingItem.episodeId !== previousItem.episodeId) {
      window.player = null
    }

    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    mediaPlayerUpdatePlaying(true)

    let nowPlayingItemIndex = -1
    if (nowPlayingItem.clipId) {
      nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    } else if (nowPlayingItem.episodeId) {
      nowPlayingItemIndex = listItems.map((x) => x.episodeId).indexOf(nowPlayingItem && nowPlayingItem.episodeId)
    }
    let queuedListItems = clone(listItems)
    nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems
    playerQueueLoadSecondaryItems(queuedListItems)

    if (user && user.id) {
      await addOrUpdateUserHistoryItem(nowPlayingItem)

      const historyItems = user.historyItems.filter(x => {
        if (x) {
          if ((x.clipStartTime || x.clipEndTime) && x.clipId !== nowPlayingItem.clipId) {
            return x
          } else if (x.episodeId !== nowPlayingItem.episodeId) {
            return x
          }
        }
      })

      historyItems.push(nowPlayingItem)

      userSetInfo({ historyItems })
    }
  }

  render() {
    const { adjustTopPosition, episodeId, mediaPlayer, pageKey, pages, podcastId, user } = this.props
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { endReached, isLoadingInitial, isLoadingMore, listItems, queryFrom, queryPage,
      querySort, queryType } = pages[pageKey]

    let mediaListItemType = 'now-playing-item'
    if (queryType === 'episodes') {
      if (queryFrom === 'from-podcast') {
        mediaListItemType = 'now-playing-item-episode-from-podcast'
      } else if (queryFrom === 'all-podcasts') {
        mediaListItemType = 'now-playing-item-episode-from-all-podcasts'
      }
    } else {
      if (queryFrom === 'from-episode') {
        mediaListItemType = 'now-playing-item-clip-from-episode'
      } else if (queryFrom === 'from-podcast') {
        mediaListItemType = 'now-playing-item-clip-from-podcast'
      }
    }

    const listItemNodes = listItems.map(x => {
      const isActive = () => {
        if (mpNowPlayingItem) {
          if (x.clipId) {
            return x.clipId === mpNowPlayingItem.clipId
          } else if (x.episodeId) {
            return x.episodeId === mpNowPlayingItem.episodeId
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
          nowPlayingItem={x}
          showMoreMenu={true} />
      )
    })

    const selectedQueryTypeOption = this.getQueryTypeOptions().filter(x => x.value === queryType)
    const selectedQueryFromOption = this.getQueryFromOptions(
      !!podcastId, !!episodeId && queryType === 'clips').filter(x => x.value === queryFrom
    )
    const selectedQuerySortOption = this.getQuerySortOptions().filter(x => x.value === querySort)

    return (      
      <div className={`media-list ${adjustTopPosition ? 'adjust-top-position' : ''}`}>
        <div className='media-list__selects'>
          <div className='media-list-selects__left'>
            <MediaListSelect
              items={this.getQueryTypeOptions()}
              selected={selectedQueryTypeOption.length > 0 ? selectedQueryTypeOption[0].value : null} />
            <MediaListSelect
              items={this.getQueryFromOptions(!!podcastId, !!episodeId && queryType === 'clips')}
              selected={selectedQueryFromOption.length > 0 ? selectedQueryFromOption[0].value : null} />
          </div>
          <div className='media-list-selects__right'>
            <div className='media-list-selects-right__spacer' />
            <MediaListSelect
              className='align-right'
              items={this.getQuerySortOptions()}
              selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
          </div>
        </div>
        {
          isLoadingInitial &&
            <div className='media-list__loader'>
              <FontAwesomeIcon icon='spinner' spin />
            </div>
        }
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
                      disabled={isLoadingMore}
                      isLoading={isLoadingMore}
                      onClick={this.queryLoadMore}
                      text='Load More' />
                }
              </div>
            </Fragment>
          }
          {
            (queryPage === 1 && listItemNodes.length === 0) &&
            <div className='no-results-msg'>No {queryType === 'episodes' ? 'episodes' : 'clips'} found</div>
          }
        </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(MediaListCtrl)
