export type NowPlayingItem = {
  clipEndTime?: number
  clipId?: string
  clipStartTime?: number
  clipTitle?: string
  episodeDescription?: string
  episodeId?: string
  episodeImageUrl?: string
  episodeMediaUrl?: string
  episodePubDate?: string
  episodeTitle?: string
  isPublic?: boolean
  ownerId?: string
  podcastId?: string
  podcastImageUrl?: string
  podcastTitle?: string
}

export const convertToNowPlayingItem = (data) => {
  let nowPlayingItem: NowPlayingItem = {}

  if (!data) { return {} }

  // If it has a pubDate field, assume it is an Episode
  if (data.pubDate) {
    nowPlayingItem.episodeDescription = data.description
    nowPlayingItem.episodeId = data.id
    nowPlayingItem.episodeMediaUrl = data.mediaUrl
    nowPlayingItem.episodePubDate = data.pubDate
    nowPlayingItem.episodeTitle = data.title
    nowPlayingItem.ownerId = ''
    nowPlayingItem.podcastImageUrl = data.podcast.imageUrl
    nowPlayingItem.podcastId = data.podcast.id
    nowPlayingItem.podcastTitle = data.podcast.title
  } else { // Else assume it is a MediaRef
    nowPlayingItem.clipEndTime = data.endTime
    nowPlayingItem.clipId = data.id
    nowPlayingItem.clipStartTime = data.startTime
    nowPlayingItem.clipTitle = data.title
    nowPlayingItem.episodeDescription = data.episode.description
    nowPlayingItem.episodeId = data.episode.id
    nowPlayingItem.episodeImageUrl = data.episode.imageUrl
    nowPlayingItem.episodeMediaUrl = data.episode.mediaUrl
    nowPlayingItem.episodePubDate = data.episode.pubDate
    nowPlayingItem.episodeTitle = data.episode.title
    nowPlayingItem.isPublic = data.isPublic
    nowPlayingItem.ownerId = data.owner && data.owner.id
    nowPlayingItem.podcastImageUrl = data.episode.podcast.imageUrl
    nowPlayingItem.podcastId = data.episode.podcast.id
    nowPlayingItem.podcastTitle = data.episode.podcast.title
  }

  return nowPlayingItem
}
