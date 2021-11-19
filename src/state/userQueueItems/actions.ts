import OmniAural from "omniaural"
import { UserQueueItem } from 'podverse-shared'
import { getQueueItemsFromServer } from '~/services/userQueueItem'

const setLatestUserQueueItems = async () => {
  const userQueueItems = await getQueueItemsFromServer()
}

const setUserQueueItems = async (userQueueItems: UserQueueItem) => {
  OmniAural.state.userQueueItems.set(userQueueItems)
}

OmniAural.addActions({ setLatestUserQueueItems, setUserQueueItems })
