
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { MediaListItem, addItemToPriorityQueueStorage } from 'podverse-ui'
import PV from '~/lib/constants'
import { generateShareURLs, getViewContentsElementScrollTop } from '~/lib/utility'
import { modalsAddToShow, modalsShareShow, pageIsLoading, pagesSetQueryState, playerQueueLoadPriorityItems,
  userSetInfo } from '~/redux/actions'
import { addQueueItemLastToServer, addQueueItemNextToServer } from '~/services'
import { withTranslation } from '~/../i18n'
import { getQueueItems } from '~/services/userQueueItem';
const uuidv4 = require('uuid/v4')

type Props = {
  canDrag?: boolean
  handlePlayItem?: (event: React.MouseEvent<HTMLButtonElement>) => void
  handleRemoveItem?: (event: React.MouseEvent<HTMLButtonElement>) => void
  hideDescription?: boolean
  hideDivider?: boolean
  isActive?: boolean
  mediaListItemType?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  modals?: any
  modalsAddToShow?: any
  modalsShareShow?: any
  nowPlayingItem?: any
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  playerQueueLoadPriorityItems?: any
  playlist?: any
  podcast?: any
  profileUser?: any
  queryFrom?: string
  queryType?: string
  settings?: any
  showMoreMenu?: boolean
  showRemove?: boolean
  t: any
  user?: any
  userSetInfo?: any
}

type State = {}

class MediaListItemCtrl extends Component<Props, State> {

  addToQueue = async (nowPlayingItem, isLast) => {
    const { playerQueueLoadPriorityItems, user } = this.props

    let priorityItems = []
    if (user && user.id) {
      priorityItems = isLast
        ? await addQueueItemLastToServer(nowPlayingItem)
        : await addQueueItemNextToServer(nowPlayingItem)
      priorityItems = priorityItems || []
    } else {
      addItemToPriorityQueueStorage(nowPlayingItem, isLast)
      priorityItems = await getQueueItems(user)
    }

    playerQueueLoadPriorityItems(priorityItems)
  }

  toggleAddToPlaylistModal = (nowPlayingItem) => {
    const { modals, modalsAddToShow } = this.props
    const { addTo } = modals
    const { isOpen } = addTo

    modalsAddToShow({
      isOpen: !isOpen,
      nowPlayingItem
    })
  }

  toggleShareModal = (nowPlayingItem) => {
    const { modals, modalsShareShow } = this.props
    const { share } = modals
    const { isOpen } = share

    const { clipLinkAs, episodeLinkAs, podcastLinkAs } = generateShareURLs(nowPlayingItem)

    modalsShareShow({
      clipLinkAs,
      episodeLinkAs,
      isOpen: !isOpen,
      podcastLinkAs
    })
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  render() {
    const { handleRemoveItem, handlePlayItem, hideDescription, hideDivider, isActive,
      mediaListItemType, nowPlayingItem, playlist, podcast, profileUser, settings, showMoreMenu,
      showRemove, t } = this.props
    const { censorNSFWText } = settings

    return (
      <MediaListItem
        censorNSFWText={censorNSFWText === 'true' || !censorNSFWText}
        dataNowPlayingItem={nowPlayingItem}
        dataPlaylist={playlist}
        dataPodcast={podcast}
        dataUser={profileUser}
        handleAddToQueueLast={() => { this.addToQueue(nowPlayingItem, true) }}
        handleAddToQueueNext={() => { this.addToQueue(nowPlayingItem, false) }}
        handleLinkClick={this.linkClick}
        handlePlayItem={() => handlePlayItem ? handlePlayItem(nowPlayingItem) : null}
        handleRemoveItem={handleRemoveItem}
        handleToggleAddToPlaylist={() => this.toggleAddToPlaylistModal(nowPlayingItem)}
        handleToggleShare={() => this.toggleShareModal(nowPlayingItem)}
        hasLink={true}
        hideDescription={hideDescription}
        hideDivider={hideDivider}
        isActive={isActive}
        isSlim={!!profileUser}
        itemType={mediaListItemType}
        key={`nowPlayingListItem-${uuidv4()}`}
        showMoreMenu={showMoreMenu}
        showRemove={showRemove}
        t={t} />
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(MediaListItemCtrl))
