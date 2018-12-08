
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MediaListItem, addItemToPriorityQueueStorage, getPriorityQueueItemsStorage
  } from 'podverse-ui'
import { bindActionCreators } from 'redux';
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, modalsAddToShow,
  playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { addOrUpdateUserHistoryItem, updateUserQueueItems } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  handleRemoveItem?: (event: React.MouseEvent<HTMLButtonElement>) => void
  isActive?: boolean
  mediaListItemType?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  modals?: any
  modalsAddToShow?: any
  nowPlayingItem?: any
  playerQueueLoadPriorityItems?: any
  queryFrom?: string
  queryType?: string
  showMoreMenu?: boolean
  showRemove?: boolean
  user?: any
  userSetInfo?: any
}

type State = {}

class MediaListItemCtrl extends Component<Props, State> {

  async addToQueue(nowPlayingItem, isLast) {
    const { playerQueueLoadPriorityItems, user } = this.props

    let priorityItems = []
    if (user && user.id) {
      isLast ? user.queueItems.push(nowPlayingItem) : user.queueItems.unshift(nowPlayingItem)

      const response = await updateUserQueueItems({ queueItems: user.queueItems })
      priorityItems = response.data || []
    } else {
      addItemToPriorityQueueStorage(nowPlayingItem, isLast)

      priorityItems = getPriorityQueueItemsStorage()
    }

    playerQueueLoadPriorityItems(priorityItems)
  }

  toggleAddToModal = (nowPlayingItem, showQueue = true) => {
    const { modals, modalsAddToShow } = this.props
    const { addTo } = modals
    const { isOpen } = addTo

    modalsAddToShow({
      isOpen: !isOpen,
      nowPlayingItem,
      showQueue
    })
  }

  async playItem(nowPlayingItem) {
    const { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, user,
      userSetInfo } = this.props
    mediaPlayerLoadNowPlayingItem(nowPlayingItem)

    mediaPlayerUpdatePlaying(true)

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
    const { handleRemoveItem, isActive, mediaListItemType, nowPlayingItem, showMoreMenu,
      showRemove } = this.props

    return (
      <MediaListItem
        dataNowPlayingItem={nowPlayingItem}
        handleAddToQueueLast={() => { this.addToQueue(nowPlayingItem, true) }}
        handleAddToQueueNext={() => { this.addToQueue(nowPlayingItem, false) }}
        handlePlayItem={() => { this.playItem(nowPlayingItem) }}
        handleRemoveItem={handleRemoveItem}
        handleToggleAddToPlaylist={() => this.toggleAddToModal(nowPlayingItem, false)}
        hasLink={true}
        isActive={isActive}
        itemType={mediaListItemType}
        key={`nowPlayingListItem-${uuidv4()}`}
        showMoreMenu={showMoreMenu}
        showRemove={showRemove} />
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaListItemCtrl)
