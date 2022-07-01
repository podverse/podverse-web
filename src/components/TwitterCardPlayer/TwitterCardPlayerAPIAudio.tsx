import OmniAural, { useOmniAural } from 'omniaural'
import { createRef, useEffect } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { retrieveLatestChaptersForEpisodeId } from '~/services/mediaRef'
import { playerGetDuration, playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { audioInitialize, audioPause, audioSeekTo } from '~/services/player/playerAudio'
import { enrichChapterDataForPlayer, handleChapterUpdateInterval } from '~/services/player/playerChapters'
import { generateChapterFlagPositions, setClipFlagPositions } from '~/services/player/playerFlags'
import { OmniAuralState } from '~/state/omniauralState'

// TODO: temporarily using require instead of require to work around a build error happening
// in the Github action pipeline: "'PlayerAudio' cannot be used as a JSX component."
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PlayerAudio = require('react-h5-audio-player').default

type Props = {
  shouldLoadChapters?: boolean
}

export const TwitterCardPlayerAPIAudio = ({ shouldLoadChapters }: Props) => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { currentNowPlayingItem } = player

  useEffect(() => {
    audioInitialize()
  }, [])

  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  const _onEnded = () => {
    audioPause()
  }

  const _onLoadedMetaData = async () => {
    if (currentNowPlayingItem.clipStartTime) {
      audioSeekTo(currentNowPlayingItem.clipStartTime)
    }

    if (Number.isInteger(currentNowPlayingItem.clipStartTime)) {
      const duration = playerGetDuration()
      setClipFlagPositions(currentNowPlayingItem, duration)
    }

    playerUpdateDuration()

    if (shouldLoadChapters && currentNowPlayingItem.episodeChaptersUrl) {
      const duration = playerGetDuration()
      const data = await retrieveLatestChaptersForEpisodeId(currentNowPlayingItem.episodeId)
      const [chapters] = data
      const enrichedChapters = enrichChapterDataForPlayer(chapters, duration)
      const chapterFlagPositions = generateChapterFlagPositions(enrichedChapters, duration)
      OmniAural.setChapterFlagPositions(chapterFlagPositions)
      OmniAural.setChapters(enrichedChapters)
    }
  }

  const _onListen = () => {
    unstable_batchedUpdates(() => {
      playerUpdatePlaybackPosition()
      playerUpdateDuration()

      if (shouldLoadChapters && currentNowPlayingItem.episodeChaptersUrl) {
        handleChapterUpdateInterval()
      }
    })
  }

  window.playerAudio = createRef()

  return (
    <PlayerAudio
      /*
        NOTE: I had to set preload to metadata to avoid bugs with WebViews
        refusing to handle changes to the <audio> currentTime properly.
        Apparently using preload auto in <audio> causes bugs in WebViews.
      */
      preload='metadata'
      onEnded={_onEnded}
      onLoadedMetaData={_onLoadedMetaData}
      onListen={_onListen}
      onSeeked={_onListen}
      ref={window.playerAudio}
    />
  )
}
