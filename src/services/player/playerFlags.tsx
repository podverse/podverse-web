import { convertToNowPlayingItem } from 'podverse-shared'
import type { MediaRef, NowPlayingItem } from 'podverse-shared'
import OmniAural from 'omniaural'

export const generateFlagPositions = (flagTimes: number[], duration: number) => {
  const flagPositions: number[] = []
  for (const flagTime of flagTimes) {
    const flagPosition = flagTime / duration
    if (flagPosition >= 0 || flagPosition <= 1) {
      flagPositions.push(flagPosition)
    }
  }
  return flagPositions
}

export const generateChapterFlagPositions = (chapters: any[], duration: number) => {
  const flagTimes: number[] = []
  if (chapters.length > 0) {
    for (const chapter of chapters) {
      flagTimes.push(chapter.startTime)
    }
  }
  return generateFlagPositions(flagTimes, duration)
}

export const generateClipFlagPositions = (nowPlayingItem: NowPlayingItem, duration: number) => {
  const flagTimes: number[] = [nowPlayingItem.clipStartTime]

  if (nowPlayingItem.clipEndTime) {
    flagTimes.push(nowPlayingItem.clipEndTime)
  }

  return generateFlagPositions(flagTimes, duration)
}

export const setClipFlagPositions = (currentNowPlayingItem: NowPlayingItem, duration: number) => {
  const clipFlagPositions = generateClipFlagPositions(currentNowPlayingItem, duration)
  OmniAural.setClipFlagPositions(clipFlagPositions)
  OmniAural.setHighlightedPositions(clipFlagPositions)
}

export const setHighlightedFlagPositionsForChapter = (chapter: MediaRef, duration: number) => {
  const nowPlayingItem = convertToNowPlayingItem(chapter)
  const highlightedFlagPositions = generateClipFlagPositions(nowPlayingItem, duration)
  OmniAural.setHighlightedPositions(highlightedFlagPositions)
}
