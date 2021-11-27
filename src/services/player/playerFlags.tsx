import type { NowPlayingItem } from 'podverse-shared'

export const generateFlagPositions = (
  flagTimes: number[],
  duration: number
) => {
  const flagPositions: number[] = []
  for (const flagTime of flagTimes) {
    const flagPosition = flagTime / duration
    if (flagPosition >= 0 || flagPosition <= 1) {
      flagPositions.push(flagPosition)
    }
  }
  return flagPositions
}

export const generateChapterFlagPositions = (
  chapters: any[],
  duration: number
) => {
  const flagTimes: number[] = []
  if (chapters.length > 0) {
    for (const chapter of chapters) {
      flagTimes.push(chapter.startTime)
    }
  }
  return generateFlagPositions(flagTimes, duration)
}


export const generateClipFlagPositions = (
  nowPlayingItem: NowPlayingItem,
  duration: number
) => {
  const flagTimes: number[] = [nowPlayingItem.clipStartTime]

  if (nowPlayingItem.clipEndTime) {
    flagTimes.push(nowPlayingItem.clipEndTime)
  }

  return generateFlagPositions(flagTimes, duration)
}
