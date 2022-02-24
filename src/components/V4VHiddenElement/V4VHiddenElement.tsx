import { useOmniAural } from 'omniaural'
import { OmniAuralState } from '~/state/omniauralState'

export const V4VHiddenElement = () => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const [v4vElementInfo] = useOmniAural('v4vElementInfo') as [OmniAuralState['v4vElementInfo']]
  const { currentNowPlayingItem, playbackPosition } = player

  if (!currentNowPlayingItem && !v4vElementInfo) {
    return null
  }
  const finalV4VInfo = currentNowPlayingItem || v4vElementInfo

  return (
    <div
      className='v4v-hidden-element'
      data-v4v-podcast-index-id={finalV4VInfo.podcastIndexPodcastId}
      data-v4v-episode-enclosure-url={finalV4VInfo.episodeMediaUrl}
      data-v4v-current-playback-position={playbackPosition}
    />
  )
}
