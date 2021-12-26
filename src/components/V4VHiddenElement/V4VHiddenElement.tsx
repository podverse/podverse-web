import { useOmniAural } from 'omniaural'

export const V4VHiddenElement = () => {
  const [player] = useOmniAural('player')
  const { currentNowPlayingItem, paused, playbackPosition } = player

  if (!currentNowPlayingItem) {
    return null
  }

  let valueTag =
    currentNowPlayingItem.episodeValue?.length > 0
    ? currentNowPlayingItem.episodeValue
    : currentNowPlayingItem.podcastValue?.length > 0
      ? currentNowPlayingItem.podcastValue
      : null
  valueTag = valueTag ? JSON.stringify(valueTag) : null

  return (
    <div
      className='v4v-hidden-element'
      {...(paused ? {} : { "data-v4v-is-playing": true })}
      data-v4v-current-playback-position={playbackPosition}
      data-v4v-podcast-index-id={currentNowPlayingItem.podcastIndexPodcastId}
      data-v4v-podcast-title={currentNowPlayingItem.podcastTitle}
      data-v4v-episode-title={currentNowPlayingItem.episodeTitle}
      data-v4v-value={valueTag} />
  )
}
