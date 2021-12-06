import OmniAural from 'omniaural'
import { UserQueueItem } from 'podverse-shared'
import {
  getQueueItemsFromServer,
  removeQueueItemEpisodeFromServer,
  removeQueueItemMediaRefFromServer,
  removeQueueItemsAllFromServer
} from '~/services/userQueueItem'

const removeQueueItemEpisode = async (episodeId: string) => {
  const userQueueItems = await removeQueueItemEpisodeFromServer(episodeId)
  OmniAural.setUserQueueItems(userQueueItems)
}

const removeQueueItemMediaRef = async (mediaRefId: string) => {
  const userQueueItems = await removeQueueItemMediaRefFromServer(mediaRefId)
  OmniAural.setUserQueueItems(userQueueItems)
}

const removeQueueItemsAll = async () => {
  const userQueueItems = await removeQueueItemsAllFromServer()
  OmniAural.setUserQueueItems(userQueueItems)
}

const setLatestUserQueueItems = async () => {
  const userQueueItems = await getQueueItemsFromServer()
}

const setUserQueueItems = async (userQueueItems: UserQueueItem) => {
  OmniAural.state.userQueueItems.set(userQueueItems)
}

OmniAural.addActions({
  removeQueueItemEpisode,
  removeQueueItemMediaRef,
  removeQueueItemsAll,
  setLatestUserQueueItems,
  setUserQueueItems
})
