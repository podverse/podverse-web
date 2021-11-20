import OmniAural from "omniaural"
import { UserHistoryItem } from 'podverse-shared'
import { removeHistoryItemEpisodeOnServer, removeHistoryItemMediaRefOnServer,
  removeHistoryItemsAllOnServer } from "~/services/userHistoryItem"

const removeHistoryItemEpisode = async (episodeId: string) => {
  const userHistoryItems = await removeHistoryItemEpisodeOnServer(episodeId)
  OmniAural.setUserHistoryItems(userHistoryItems)
}

const removeHistoryItemMediaRef = async (mediaRefId: string) => {
  const userHistoryItems = await removeHistoryItemMediaRefOnServer(mediaRefId)
  OmniAural.setUserHistoryItems(userHistoryItems)
}

const removeHistoryItemsAll = async () => {
  const userHistoryItems = await removeHistoryItemsAllOnServer()
  OmniAural.setUserHistoryItems(userHistoryItems)
}

const setUserHistoryItems = async (userHistoryItems: UserHistoryItem) => {
  OmniAural.state.userHistoryItems.set(userHistoryItems)
}

OmniAural.addActions({
  removeHistoryItemEpisode,
  removeHistoryItemMediaRef,
  removeHistoryItemsAll,
  setUserHistoryItems
})
