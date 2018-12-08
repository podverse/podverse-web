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
  userPlaybackPosition?: number
}

export const convertToNowPlayingItem = (data, userPlaybackPosition = 0) => {
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
    nowPlayingItem.userPlaybackPosition = userPlaybackPosition || 0
  } else { // Else assume it is a MediaRef
    nowPlayingItem.clipEndTime = data.endTime
    nowPlayingItem.clipId = data.id
    nowPlayingItem.clipStartTime = data.startTime
    nowPlayingItem.clipTitle = data.title
    nowPlayingItem.episodeDescription = (data.episode && data.episode.description) || data.episodeDescription
    nowPlayingItem.episodeId = (data.episode && data.episode.id) || data.episodeId
    nowPlayingItem.episodeImageUrl = (data.episode && data.episode.imageUrl) || data.episodeImageUrl
    nowPlayingItem.episodeMediaUrl = (data.episode && data.episode.mediaUrl) || data.episodeMediaUrl
    nowPlayingItem.episodePubDate = (data.episode && data.episode.pubDate) || data.episodePubDate
    nowPlayingItem.episodeTitle = (data.episode && data.episode.title) || data.episodeTitle
    nowPlayingItem.isPublic = data.isPublic
    nowPlayingItem.ownerId = data.owner && data.owner.id
    nowPlayingItem.podcastImageUrl = (data.episode && data.episode.podcast && data.episode.podcast.imageUrl) || data.podcastImageUrl
    nowPlayingItem.podcastId = (data.episode && data.episode.podcast && data.episode.podcast.id) || data.podcastId
    nowPlayingItem.podcastTitle = (data.episode && data.episode.podcast && data.episode.podcast.title) || data.podcastTitle
    nowPlayingItem.userPlaybackPosition = userPlaybackPosition || data.clipStartTime || 0
  }

  return nowPlayingItem
}
