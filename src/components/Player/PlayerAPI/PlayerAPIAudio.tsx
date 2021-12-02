import OmniAural, { useOmniAural } from 'omniaural'
import { createRef, useEffect } from 'react'
import {unstable_batchedUpdates} from "react-dom";
import PlayerAudio from 'react-h5-audio-player'
import { retrieveLatestChaptersForEpisodeId } from '~/services/mediaRef'
import { playerGetDuration, playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { audioInitialize, audioSeekTo } from '~/services/player/playerAudio'
import { enrichChapterDataForPlayer, handleChapterUpdateInterval } from '~/services/player/playerChapters'
import { generateChapterFlagPositions, setClipFlagPositions } from '~/services/player/playerFlags'
import { addOrUpdateHistoryItemOnServer } from '~/services/userHistoryItem'

type Props = {}

export const PlayerAPIAudio = (props: Props) => {
  const [player] = useOmniAural('player')
  const [historyItemsIndex] = useOmniAural('historyItemsIndex')
  const { currentNowPlayingItem } = player

  useEffect(() => {
    console.log('useEffect')
    audioInitialize()
  }, [])

  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  const _onEnded = async () => {
    const playbackPosition = 0
    const mediaFileDuration = playerGetDuration()
    const forceUpdateOrderDate = false
    const skipSetNowPlaying = true
    const completed = true
    await addOrUpdateHistoryItemOnServer(
      currentNowPlayingItem,
      playbackPosition,
      mediaFileDuration,
      forceUpdateOrderDate,
      skipSetNowPlaying,
      completed
    )
  }

  const _onLoadedMetaData = async () => {
    console.log('PlayerAPIAudio _onLoadedMetaData')
    if (currentNowPlayingItem.clipStartTime) {
      audioSeekTo(currentNowPlayingItem.clipStartTime)
    }
    const duration = playerGetDuration()

    const historyItem = historyItemsIndex.episodes[currentNowPlayingItem.episodeId]

    if (Number.isInteger(currentNowPlayingItem.clipStartTime)) {
      setClipFlagPositions(currentNowPlayingItem, duration)
    } else if (historyItem) {
      audioSeekTo(historyItem.userPlaybackPosition)
    }

    const playbackPosition = currentNowPlayingItem.clipStartTime
      || historyItem?.userPlaybackPosition || 0
    const forceUpdateOrderDate = true
    const skipSetNowPlaying = false
    addOrUpdateHistoryItemOnServer(
      currentNowPlayingItem,
      playbackPosition,
      duration,
      forceUpdateOrderDate,
      skipSetNowPlaying
    )
    
    if (currentNowPlayingItem.episodeChaptersUrl) {
      const data = await retrieveLatestChaptersForEpisodeId(currentNowPlayingItem.episodeId)
      const [chapters, chaptersCount] = data
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
      handleChapterUpdateInterval()
    })
  }

  window.playerAudio = createRef()

  return (
    <PlayerAudio
      onEnded={_onEnded}
      onLoadedMetaData={_onLoadedMetaData}
      onListen={_onListen}
      onSeeked={_onListen}
      ref={window.playerAudio} />
  )
}
