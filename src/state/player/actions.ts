import OmniAural from 'omniaural'
import type { EpisodeAlternateEnclosure, MediaRef, NowPlayingItem } from 'podverse-shared'
import { setV4VPlayerInfoItemToWindow, setV4VPlayerInfoPlaybackPositionToWindow } from '~/services/v4v'

const togglePlayer = (show: boolean) => {
  OmniAural.state.player.show.set(show)
}

const setPlayerItem = (currentNowPlayingItem: NowPlayingItem) => {
  OmniAural.state.player.currentNowPlayingItem.set(null)
  OmniAural.state.player.currentNowPlayingItem.set(currentNowPlayingItem)
  OmniAural.state.player.show.set(true)

  setV4VPlayerInfoItemToWindow(currentNowPlayingItem)
}

const setPlayerPlaybackPosition = (position: number) => {
  const finalPosition = Math.floor(position)
  OmniAural.state.player.playbackPosition.set(finalPosition)

  setV4VPlayerInfoPlaybackPositionToWindow(finalPosition)
}

const setPlayerDuration = (duration: number) => {
  OmniAural.state.player.duration.set(Math.floor(duration))
}

const setPlaySpeed = (newSpeed: number) => {
  OmniAural.state.player.playSpeed.set(newSpeed)
}

const setAlternateEnclosureSelectedIndex = (index: number) => {
  OmniAural.state.player.alternateEnclosureSelectedIndex.set(index)
  OmniAural.state.player.alternateEnclosureSourceSelectedIndex.set(0)
}

const setAlternateEnclosureSourceSelectedIndex = (index: number) => {
  OmniAural.state.player.alternateEnclosureSourceSelectedIndex.set(index)
}

const clearAlternateEnclosureSelectedIndex = () => {
  OmniAural.state.player.alternateEnclosureSelectedIndex.set(null)
  OmniAural.state.player.alternateEnclosureSourceSelectedIndex.set(null)
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

  setTimeout(() => {
    const playerFullViewAriaHeader = document.querySelector('.player-full-view .aria-header') as HTMLElement
    playerFullViewAriaHeader?.focus()
  }, 0)
}

const playerIsAtCurrentLiveStreamTime = () => {
  OmniAural.state.player.isAtCurrentLiveStreamTime.set(true)
}

const playerIsNotAtCurrentLiveStreamTime = () => {
  OmniAural.state.player.isAtCurrentLiveStreamTime.set(false)
}

const playerIsNotInitialLoad = () => {
  OmniAural.state.player.isInitialLoad.set(false)
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
  setAlternateEnclosureSelectedIndex,
  setAlternateEnclosureSourceSelectedIndex,
  clearAlternateEnclosureSelectedIndex,
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
  playerIsAtCurrentLiveStreamTime,
  playerIsNotAtCurrentLiveStreamTime,
  playerIsNotInitialLoad,
  playerSetVideoSrc
})
