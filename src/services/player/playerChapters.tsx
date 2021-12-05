import OmniAural from 'omniaural'
import { convertNowPlayingItemToEpisode, convertToNowPlayingItem } from 'podverse-shared'
import { unstable_batchedUpdates } from 'react-dom'
import { playerGetDuration, playerGetPosition } from './player'
import { setHighlightedFlagPositionsForChapter } from './playerFlags'

let chapterUpdateInterval = null

export const clearChapterUpdateInterval = () => {
  if (chapterUpdateInterval) {
    clearInterval(chapterUpdateInterval)
  }
}

export const handleChapterUpdateInterval = () => {
  const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  const currentChapter = getChapterForTime()
  if (currentChapter && !(currentNowPlayingItem.clipId && !currentNowPlayingItem.clipIsOfficialChapter)) {
    const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
    const episode = convertNowPlayingItemToEpisode(currentNowPlayingItem)
    const nowPlayingItem = convertToNowPlayingItem(currentChapter, episode, episode.podcast)
    
    /*
      Set the mediaRef.imageUrl for the chapter as the episodeImageUrl
      on the nowPlayingItem so that chapter art loads in the Player views.
    */
   nowPlayingItem.episodeImageUrl = currentChapter.imageUrl ? currentChapter.imageUrl : nowPlayingItem.episodeImageUrl

    if (currentNowPlayingItem.clipId !== nowPlayingItem.clipId) {
      unstable_batchedUpdates(() => {
        OmniAural.setPlayerItem(nowPlayingItem)
      })
    }

    const duration = playerGetDuration()
    setHighlightedFlagPositionsForChapter(currentChapter, duration)
  }
}

export const getChapterForTime = () => {
  const chapters = OmniAural.state.player.chapters.value()
  const position = playerGetPosition()
  const duration = playerGetDuration()
  let currentChapter = null
  if (chapters && chapters.length > 1) {
    currentChapter = chapters.find(
      // If no chapter.endTime, then assume it is the last chapter, and use the duration instead
      (chapter: any) =>
        chapter.endTime
          ? position >= chapter.startTime && position < chapter.endTime
          : position >= chapter.startTime && duration && position < duration
    )
  }

  return currentChapter
}

export const enrichChapterDataForPlayer = (chapters: any[], duration: number) => {
  const enrichedChapters = []
  let hasCustomImage = false

  if (Array.isArray(chapters) && chapters.length > 0) {
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i]
      const nextChapter = chapters[i + 1]
      if (!chapter?.endTime && nextChapter) {
        chapter.endTime = nextChapter.startTime
      } else if (!chapter?.endTime && duration) {
        chapter.endTime = duration
      }
      if (chapter && chapter.imageUrl) {
        hasCustomImage = true
      }
      enrichedChapters.push(chapter)
    }
  }

  const enrichedChaptersFinal = []
  for (const enrichedChapter of enrichedChapters) {
    if (hasCustomImage) {
      enrichedChapter.hasCustomImage = true
      enrichedChaptersFinal.push(enrichedChapter)
    }
  }

  return enrichedChapters
}

export const getChapterNext = () => {
  return getChapter(1)
}

export const getChapterPrevious = () => {
  return getChapter(-1)
}

export const getChapter = (offset = 0) => {
  const player = OmniAural.state.player.value()
  const { currentNowPlayingItem, chapters } = player
  if (currentNowPlayingItem && chapters?.length && chapters.length > 1) {
    const currentIndex = chapters.findIndex((x: any) => x.id === currentNowPlayingItem.clipId)
    const offsetIndex = currentIndex + offset
    const newChapter = chapters[offsetIndex]
    return newChapter
  }
}
