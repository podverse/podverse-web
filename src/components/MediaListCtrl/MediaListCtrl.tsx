
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
  listItems: any[]
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
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

type State = {
  currentId?: string
  endReached?: boolean
  isLoadingInitial?: boolean
  isLoadingMore?: boolean
  listItems: any[]
  queryFrom?: string
  queryPage: number
  querySort?: string
  queryType?: string
}

class MediaListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    listItems: [],
    queryFrom: 'all-podcasts',
    queryPage: 1,
    querySort: 'top-past-week',
    queryType: 'clips'
  }

  constructor(props) {
    super(props)

    this.state = {
      currentId: props.currentId,
      listItems: props.listItems || [],
      queryFrom: props.queryFrom,
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
        queryFrom: props.queryFrom,
        queryPage: props.queryPage,
        querySort: props.querySort,
        queryType: props.queryType
      }
    }

    return null
  }

  async queryMediaListItems(selectedKey = '', selectedValue = '', page = 1) {
    const { episodeId, playerQueueAddSecondaryItems, playerQueueLoadSecondaryItems,
      podcastId, settings, user } = this.props
    const { nsfwMode } = settings
    const { subscribedPodcastIds } = user
    const { listItems, queryFrom, querySort, queryType } = this.state

    let query: any = {
      from: queryFrom,
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
    } else if (selectedKey === 'from') {
      newState.queryFrom = selectedValue
      query.from = selectedValue
    } else if (selectedKey === 'sort') {
      newState.querySort = selectedValue
      query.sort = selectedValue
    }

    if (['type', 'from', 'sort'].includes(selectedKey)) {
      newState.isLoadingInitial = true
    }

    this.setState(newState)
    
    let combinedListItems: any = []

    if (page > 1) {
      combinedListItems = listItems
    }

    if (query.from === 'from-podcast') {
      query.podcastId = podcastId
    } else if (query.from === 'subscribed-only') {
      query.subscribedPodcastIds = subscribedPodcastIds
    } else {
      // all-podcasts, add nothing
    }

    if (query.type === 'clips') {
      if (query.from === 'from-episode') {
        query.episodeId = episodeId
      }
      
      try {
        const response = await getMediaRefsByQuery(query, nsfwMode)
        const mediaRefs = response.data && response.data.map(x => convertToNowPlayingItem(x))
        combinedListItems = combinedListItems.concat(mediaRefs)
        
        if (page > 1) {
          playerQueueAddSecondaryItems(clone(mediaRefs))
        } else {
          playerQueueLoadSecondaryItems(clone(mediaRefs))
        }

        this.setState({
          endReached: mediaRefs.length < 2,
          isLoadingInitial: false,
          isLoadingMore: false,
          listItems: page > 1 ? combinedListItems : mediaRefs
        })
      } catch (error) {
        console.log(error)
        this.setState({
          isLoadingInitial: false,
          isLoadingMore: false
        })
      }
    } else if (query.type === 'episodes') {
      try {
        const response = await getEpisodesByQuery(query, nsfwMode)
        const episodes = response.data && response.data.map(x => convertToNowPlayingItem(x))
        combinedListItems = combinedListItems.concat(episodes)

        if (page > 1) {
          playerQueueAddSecondaryItems(clone(episodes))
        } else {
          playerQueueLoadSecondaryItems(clone(episodes))
        }

        this.setState({
          endReached: episodes.length < 2,
          isLoadingInitial: false,
          isLoadingMore: false,
          listItems: page > 1 ? combinedListItems : episodes
        })
      } catch (error) {
        console.log(error)
        this.setState({
          isLoadingInitial: false,
          isLoadingMore: false
        })
      }

    }
  }

  getQueryTypeOptions() {
    return [
      {
        label: 'Clips',
        onClick: () => this.queryMediaListItems('type', 'clips'),
        value: 'clips',
      },
      {
        label: 'Episodes',
        onClick: () => this.queryMediaListItems('type', 'episodes'),
        value: 'episodes',
      }
    ]
  }

  getQueryFromOptions(showFromPodcast, showFromEpisode, isLoggedIn) {

    const options = [
      {
        label: 'All podcasts',
        onClick: () => this.queryMediaListItems('from', 'all-podcasts'),
        value: 'all-podcasts'
      },
      {
        label: 'Subscribed only',
        onClick: () => {
          if (isLoggedIn) {
            this.queryMediaListItems('from', 'subscribed-only')
          } else {
            alert('Login to filter clips and episodes by your subscribed podcasts.')
          }
        },
        value: 'subscribed-only'
      }
    ]

    if (showFromPodcast) {
      options.push(
        {
          label: 'From this podcast',
          onClick: () => this.queryMediaListItems('from', 'from-podcast'),
          value: 'from-podcast'
        }
      )
    }

    if (showFromEpisode) {
      options.push(
        {
          label: 'From this episode',
          onClick: () => this.queryMediaListItems('from', 'from-episode'),
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
      },
      {
        label: 'most recent',
        onClick: () => this.queryMediaListItems('sort', 'most-recent'),
        value: 'most-recent'
      }
    ]
  }

  async playItem(nowPlayingItem) {
    const { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      playerQueueLoadSecondaryItems, user, userSetInfo } = this.props
    const { listItems } = this.state

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
    const { adjustTopPosition, episodeId, mediaPlayer, podcastId, user } = this.props
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { endReached, isLoadingInitial, isLoadingMore, listItems, queryFrom, queryPage,
      querySort, queryType } = this.state

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
    const selectedQueryFromOption = this.getQueryFromOptions(!!podcastId, !!episodeId && queryType === 'clips', !!user && !!user.id).filter(x => x.value === queryFrom)
    const selectedQuerySortOption = this.getQuerySortOptions().filter(x => x.value === querySort)

    return (      
      <div className={`media-list ${adjustTopPosition ? 'adjust-top-position' : ''}`}>
        <div className='media-list__selects'>
          <div className='media-list-selects__left'>
            <MediaListSelect
              items={this.getQueryTypeOptions()}
              selected={selectedQueryTypeOption.length > 0 ? selectedQueryTypeOption[0].value : null} />
            <MediaListSelect
              items={this.getQueryFromOptions(!!podcastId, !!episodeId && queryType === 'clips', user && user.id)}
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
                (!endReached && listItemNodes.length === 0) &&
                <div className='no-results-msg'>No {queryType === 'episodes' ? 'episodes' : 'clips'} found</div>
              }
            </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(MediaListCtrl)
