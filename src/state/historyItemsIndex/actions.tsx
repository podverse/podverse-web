import OmniAural from 'omniaural'

type HistoryItemsIndex = {
  episodes: Record<string, unknown>
  mediaRefs: Record<string, unknown>
}

const clearHistoryItemsIndex = () => {
  OmniAural.state.historyItemsIndex.set({
    episodes: {},
    mediaRefs: {}
  })
}

const setHistoryItemsIndex = (historyItemsIndex: HistoryItemsIndex) => {
  OmniAural.state.historyItemsIndex.set(historyItemsIndex)
}

OmniAural.addActions({ clearHistoryItemsIndex, setHistoryItemsIndex })
