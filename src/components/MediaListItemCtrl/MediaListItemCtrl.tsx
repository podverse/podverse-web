
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MediaListItem, addItemToPriorityQueueStorage, getPriorityQueueItemsStorage
  } from 'podverse-ui'
import { bindActionCreators } from 'redux';
import { modalsAddToShow, playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { updateUserQueueItems } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  canDrag?: boolean
  handlePlayItem?: (event: React.MouseEvent<HTMLButtonElement>) => void
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

  render() {
    const { handleRemoveItem, handlePlayItem, isActive, mediaListItemType, nowPlayingItem,
      showMoreMenu, showRemove } = this.props

    return (
      <MediaListItem
        dataNowPlayingItem={nowPlayingItem}
        handleAddToQueueLast={() => { this.addToQueue(nowPlayingItem, true) }}
        handleAddToQueueNext={() => { this.addToQueue(nowPlayingItem, false) }}
        handlePlayItem={() => { handlePlayItem ? handlePlayItem(nowPlayingItem) : null }}
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
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaListItemCtrl)
