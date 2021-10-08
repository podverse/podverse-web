import React, { Component, Fragment } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemToPriorityQueueStorage, Button, getPriorityQueueItemsStorage,
  MediaListItem, removeItemFromPriorityQueueStorage,
  updatePriorityQueueStorage } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { safeAlert } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadItems,
  playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { withTranslation } from 'i18n'
import { addQueueItemLastToServer, addQueueItemNextToServer, addQueueItemToServer, getQueueItems, removeQueueItemOnServer } from '~/services/userQueueItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const { PUBLIC_BASE_URL } = config()

type Props = {
  lastScrollPosition?: number
  mediaPlayer: any
  pageKey?: string
  playerQueue: any
  playerQueueLoadItems: any
  playerQueueLoadPriorityItems: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {
  isEditing?: boolean
  isRemoving?: boolean
}

class Queue extends Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages, isRemoving } = state

    const currentPage = pages[PV.pageKeys.queue] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return { lastScrollPosition, pageKey: PV.pageKeys.queue, namespacesRequired, isRemoving }
  }

  onDragEnd = async data => {
    const { playerQueue, playerQueueLoadItems, user, userSetInfo } = this.props
    let { priorityItems } = playerQueue
    const { destination, source } = data

    const sourceIndex = source && source.index ? source.index : 0
    let destinationIndex = destination && destination.index ? destination.index : 0
    const offset = destinationIndex < sourceIndex ? -1 : 0
    destinationIndex = ((destinationIndex + 1) * 1000) + offset

    if (user && user.id) {
      priorityItems = await addQueueItemToServer(priorityItems[source.index], destinationIndex)
    } else {
      let itemToMove: any = []

      if (destination && source) {
        if (source.droppableId === 'priority-items') {
          itemToMove = priorityItems.splice(source.index, 1)
        }

        if (itemToMove.length > 0) {
          if (destination.droppableId === 'priority-items') {
            priorityItems.splice(destination.index, 0, itemToMove[0])
          }
        }
      }

      updatePriorityQueueStorage(priorityItems)
    }

    playerQueueLoadItems({ priorityItems })

    userSetInfo({ queueItems: priorityItems })
  }

  toggleEditMode = () => {
    const { isEditing } = this.state
    this.setState({ isEditing: !isEditing })
  }

  addToQueue = async isLast => {
    const { mediaPlayer, playerQueueLoadPriorityItems, user, userSetInfo } = this.props
    const { nowPlayingItem } = mediaPlayer

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
    userSetInfo({ queueItems: priorityItems })
  }

  removeQueueItem = async (clipId, episodeId) => {
    this.setState({ isRemoving: true })
    const { playerQueueLoadPriorityItems, t, user, userSetInfo } = this.props

    if (user && user.id) {
      try {
        const userQueueItems = await removeQueueItemOnServer(clipId, episodeId)
        userSetInfo({ queueItems: userQueueItems })
        playerQueueLoadPriorityItems(userQueueItems)
      } catch (error) {
        console.log(error)
        safeAlert(t('errorMessages:alerts.couldNotUpdateQueue'))
      }
    } else {
      removeItemFromPriorityQueueStorage(clipId, episodeId)
      const priorityItems = getPriorityQueueItemsStorage()
      userSetInfo({ queueItems: priorityItems })
      playerQueueLoadPriorityItems(priorityItems)
    }

    this.setState({ isRemoving: false })
  }

  render() {
    const { mediaPlayer, playerQueue, t } = this.props
    const { nowPlayingItem } = mediaPlayer

    const { priorityItems } = playerQueue

    const { isEditing, isRemoving } = this.state

    const meta = {
      currentUrl: PUBLIC_BASE_URL + PV.paths.web.queue,
      description: t('pages:queue._Description'),
      title: t('pages:queue._Title')
    }

    const header = (
      <div className='queue-modal__header'>
        <h3><FontAwesomeIcon icon='list-ul' /> &nbsp;{t('Queue')}</h3>
        <div className='queue-modal-header__edit'>
          <Button
            onClick={this.toggleEditMode}>
            {
              isEditing ?
                <React.Fragment><FontAwesomeIcon icon='check' /> {t('Done')}</React.Fragment>
                : <React.Fragment><FontAwesomeIcon icon='edit' /> {t('Edit')}</React.Fragment>
            }
          </Button>
        </div>
      </div>
    )

    let priorityItemNodes: any = []

    const queueModalPriorityItemKey = 'queueModalPriorityItemKey'
    priorityItemNodes = Array.isArray(priorityItems) ? priorityItems.map((x, index) => (
      <Draggable
        draggableId={`priority-item-${index}`}
        index={index}
        key={`${queueModalPriorityItemKey}${index}`}>
        {(provided, snapshot) => (
          <React.Fragment>
            <div
              key={`${queueModalPriorityItemKey}b${index}`}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}>
              <MediaListItem
                dataNowPlayingItem={x}
                handleRemoveItem={() => this.removeQueueItem(x.clipId, x.episodeId)}
                isRemoving={isRemoving}
                hasLink
                hideDescription={true}
                hideDivider={true}
                itemType='now-playing-item'
                key={`${queueModalPriorityItemKey}c${index}`}
                showMove={!isEditing}
                showRemove={isEditing}
                t={t}
                useEpisodeImageUrl={true} />
            </div>
            <hr className='pv-divider' />
          </React.Fragment>
        )}
      </Draggable>
    )) : []
    
    const isClip = nowPlayingItem && nowPlayingItem.clipId
    const itemType = isClip ? 'now-playing-item-queue-clip' : 'now-playing-item-queue-episode'
    const noItemsInQueueFoundMsg = priorityItemNodes.length ? '' : t('ThereAreNoItemsInYourQueue')

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={false}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <div className='queue'>
          {header}
          <React.Fragment>
            {
              nowPlayingItem &&
              <React.Fragment>
                <h6>{t('Now Playing')}</h6>
                <div className='media-list__container-now-playing'>
                  <MediaListItem
                    dataNowPlayingItem={nowPlayingItem}
                    hasLink
                    hideDescription={true}
                    hideDivider={true}
                    itemType={itemType}
                    t={t}
                    useEpisodeImageUrl={true} />
                </div>
              </React.Fragment>
            }
            <DragDropContext
              onDragEnd={this.onDragEnd}>
              {
                <React.Fragment>
                  <h6>{t('Next Up')}</h6>
                  {noItemsInQueueFoundMsg && (
                    <p>{noItemsInQueueFoundMsg}</p>
                  )}
                  <Droppable droppableId='priority-items'>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'transparent' }}
                        {...provided.droppableProps}>
                        {priorityItemNodes}
                      </div>
                    )}
                  </Droppable>
                </React.Fragment>
              }
            </DragDropContext>
          </React.Fragment>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadItems: bindActionCreators(playerQueueLoadItems, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Queue))
