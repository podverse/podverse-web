


export const getNowPlayingItem = async () => {
  const useServerData = await checkIfShouldUseServerData()
  return useServerData ? getNowPlayingItemOnServer() : getNowPlayingItemLocally()
}

export const setNowPlayingItem = async (item: NowPlayingItem | null, playbackPosition: number) => {
  const useServerData = await checkIfShouldUseServerData()
  return useServerData && !item?.addByRSSPodcastFeedUrl
    ? setNowPlayingItemOnServer(item, playbackPosition)
    : setNowPlayingItemLocally(item, playbackPosition)
}

export const clearNowPlayingItem = async () => {
  const useServerData = await checkIfShouldUseServerData()
  return useServerData ? clearNowPlayingItemOnServer() : clearNowPlayingItemLocally()
}


