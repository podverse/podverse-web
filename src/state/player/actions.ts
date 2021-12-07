import OmniAural from 'omniaural'
import type { MediaRef, NowPlayingItem } from 'podverse-shared'

const togglePlayer = (show: boolean) => {
  OmniAural.state.player.show.set(show)
}

const setPlayerItem = (currentNowPlayingItem: NowPlayingItem) => {
  OmniAural.state.player.currentNowPlayingItem.set(null)
  OmniAural.state.player.currentNowPlayingItem.set(currentNowPlayingItem)
  OmniAural.state.player.show.set(true)
}

const setPlayerPlaybackPosition = (position: number) => {
  OmniAural.state.player.playbackPosition.set(Math.floor(position))
}

const setPlayerDuration = (duration: number) => {
  OmniAural.state.player.duration.set(Math.floor(duration))
}

const setPlaySpeed = (newSpeed: number) => {
  OmniAural.state.player.playSpeed.set(newSpeed)
}

const pausePlayer = () => {
  OmniAural.state.player.paused.set(true)
}

const playPlayer = () => {
  OmniAural.state.player.paused.set(false)
}

const playerSetVolume = (newVolume: number) => {
  OmniAural.state.player.volume.set(newVolume)
}

const mutePlayer = () => {
  OmniAural.state.player.muted.set(true)
}

const unmutePlayer = () => {
  OmniAural.state.player.muted.set(false)
}

const setChapterFlagPositions = (chapterFlagPositions: number[]) => {
  OmniAural.state.player.chapterFlagPositions.set(chapterFlagPositions)
}

const setChapters = (chapters: MediaRef[]) => {
  OmniAural.state.player.chapters.set(chapters)
}

const setClipHasReachedEnd = (hasReachedEnd: boolean) => {
  OmniAural.state.player.clipHasReachedEnd.set(hasReachedEnd)
}

const setClipFlagPositions = (clipFlagPositions: number[]) => {
  OmniAural.state.player.clipFlagPositions.set(clipFlagPositions)
}

const setHighlightedPositions = (highlightedPositions: number[]) => {
  OmniAural.state.player.highlightedPositions.set(highlightedPositions)
}

const playerFullViewHide = () => {
  OmniAural.state.player.showFullView.set(false)
}

const playerFullViewShow = () => {
  OmniAural.state.player.showFullView.set(true)
}

const playerSetVideoSrc = (src: string) => {
  OmniAural.state.player.video.src.set(src || '')
}

OmniAural.addActions({
  playerFullViewHide,
  playerFullViewShow,
  mutePlayer,
  pausePlayer,
  playerSetVolume,
  playPlayer,
  setChapterFlagPositions,
  setChapters,
  setClipHasReachedEnd,
  setClipFlagPositions,
  setHighlightedPositions,
  setPlayerDuration,
  setPlayerItem,
  setPlayerPlaybackPosition,
  setPlaySpeed,
  togglePlayer,
  unmutePlayer,
  playerSetVideoSrc
})
