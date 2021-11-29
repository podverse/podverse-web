import OmniAural, { useOmniAural } from 'omniaural'
import { createRef, useEffect } from 'react'
import PlayerAudio from 'react-h5-audio-player'
import { retrieveLatestChaptersForEpisodeId } from '~/services/mediaRef'
import { playerGetDuration, playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { audioInitialize, audioSeekTo } from '~/services/player/playerAudio'
import { enrichChapterDataForPlayer, handleChapterUpdateInterval, setChapterUpdateInterval } from '~/services/player/playerChapters'
import { generateChapterFlagPositions, generateClipFlagPositions } from '~/services/player/playerFlags'

type Props = {}

declare global {
  /* *TODO* add playerAudio type */
  interface Window { playerAudio: any }
}

export const PlayerAPIAudio = (props: Props) => {
  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  const [player] = useOmniAural('player')
  const { currentNowPlayingItem } = player

  useEffect(() => {
    console.log('useEffect')
    audioInitialize()
  }, [])

  const _onLoadedMetaData = async () => {
    console.log('PlayerAPIAudio _onLoadedMetaData')
    if (currentNowPlayingItem.clipStartTime) {
      audioSeekTo(currentNowPlayingItem.clipStartTime)
    }

    const duration = playerGetDuration()

    if (Number.isInteger(currentNowPlayingItem.clipStartTime)) {
      const clipFlagPositions = generateClipFlagPositions(currentNowPlayingItem, duration)
      OmniAural.setClipFlagPositions(clipFlagPositions)
      OmniAural.setHighlightedPositions(clipFlagPositions)
    }
    
    if (currentNowPlayingItem.episodeChaptersUrl) {
      // const data = await retrieveLatestChaptersForEpisodeId(currentNowPlayingItem.episodeId)
      // const [chapters, chaptersCount] = data
      // const enrichedChapters = enrichChapterDataForPlayer(chapters, duration)
      // const chapterFlagPositions = generateChapterFlagPositions(enrichedChapters, duration)
      // OmniAural.setChapterFlagPositions(chapterFlagPositions)
      // OmniAural.setChapters(enrichedChapters)
      // setChapterUpdateInterval()
    }
  }

  const _onListen = () => {
    playerUpdatePlaybackPosition()
    playerUpdateDuration()
  }

  window.playerAudio = createRef()

  return (
    <PlayerAudio
      // listenInterval={4000}
      onLoadedMetaData={_onLoadedMetaData}
      onListen={_onListen}
      ref={window.playerAudio} />
  )
}
