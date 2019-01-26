
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MediaListItem, addItemToPriorityQueueStorage, getPriorityQueueItemsStorage
  } from 'podverse_ui'
import { bindActionCreators } from 'redux';
import { modalsAddToShow, pageIsLoading, playerQueueLoadPriorityItems,
  userSetInfo } from '~/redux/actions'
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
  pageIsLoading?: any
  playerQueueLoadPriorityItems?: any
  playlist?: any
  podcast?: any
  profileUser?: any
  queryFrom?: string
  queryType?: string
  showMoreMenu?: boolean
  showRemove?: boolean
  user?: any
  userSetInfo?: any
}

type State = {}

class MediaListItemCtrl extends Component<Props, State> {

  constructor (props) {
    super(props)

    this.linkClick = this.linkClick.bind(this)
  }

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

  linkClick () {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
  }

  render() {
    const { handleRemoveItem, handlePlayItem, isActive, mediaListItemType, nowPlayingItem,
      playlist, podcast, profileUser, showMoreMenu, showRemove } = this.props

    return (
      <MediaListItem
        dataNowPlayingItem={nowPlayingItem}
        dataPlaylist={playlist}
        dataPodcast={podcast}
        dataUser={profileUser}
        handleAddToQueueLast={() => { this.addToQueue(nowPlayingItem, true) }}
        handleAddToQueueNext={() => { this.addToQueue(nowPlayingItem, false) }}
        handleLinkClick={this.linkClick}
        handlePlayItem={() => { handlePlayItem ? handlePlayItem(nowPlayingItem) : null }}
        handleRemoveItem={handleRemoveItem}
        handleToggleAddToPlaylist={() => this.toggleAddToModal(nowPlayingItem, false)}
        hasLink={true}
        isActive={isActive}
        isSlim={!!profileUser}
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
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaListItemCtrl)
