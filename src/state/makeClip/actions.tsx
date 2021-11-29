import OmniAural from "omniaural"
import { NowPlayingItem } from "podverse-shared"
import { convertSecToHHMMSS } from "~/lib/utility/time"

/* Time parameters should be in hh:mm:ss string format */

const makeClipSetClipFlagPositions = (clipFlagPositions: number[]) => {
  OmniAural.state.makeClip.clipFlagPositions.set(clipFlagPositions)
}

const makeClipSetHighlightedPositions = (highlightedPositions: number[]) => {
  OmniAural.state.makeClip.highlightedPositions.set(highlightedPositions)
}

const makeClipClearState = () => {
  OmniAural.state.makeClip.clipFlagPositions.set([])
  OmniAural.state.makeClip.endTime.set('')
  OmniAural.state.makeClip.highlightedPositions.set([])
  OmniAural.state.makeClip.isEditing.set(false)
  OmniAural.state.makeClip.show.set(false)
  OmniAural.state.makeClip.startTime.set('')
  OmniAural.state.makeClip.successModalLinkUrl.set('')
  OmniAural.state.makeClip.title.set('')
}

const makeClipHide = () => {
  OmniAural.state.makeClip.isEditing.set(false)
  OmniAural.state.makeClip.show.set(false)
}

const makeClipSetEndTime = (endTime: string) => {
  OmniAural.state.makeClip.endTime.set(endTime)
}

const makeClipSetIsPublic = (isPublic: boolean) => {
  OmniAural.state.makeClip.isPublic.set(isPublic)
}

const makeClipSetStartTime = (startTime: string) => {
  OmniAural.state.makeClip.startTime.set(startTime)
}

const makeClipSetTitle = (title: string) => {
  OmniAural.state.makeClip.title.set(title)
}

const makeClipShow = () => {
  OmniAural.state.makeClip.show.set(true)
}

const makeClipShowEditing = (nowPlayingItem: NowPlayingItem) => {
  const endTimeHHMMSS = convertSecToHHMMSS(nowPlayingItem.clipEndTime)
  const startTimeHHMMSS = convertSecToHHMMSS(nowPlayingItem.clipStartTime)
  OmniAural.state.makeClip.endTime.set(endTimeHHMMSS)
  OmniAural.state.makeClip.isPublic.set(nowPlayingItem.isPublic)
  OmniAural.state.makeClip.startTime.set(startTimeHHMMSS)
  OmniAural.state.makeClip.title.set(nowPlayingItem.clipTitle)
  OmniAural.state.makeClip.isEditing.set(true)
  OmniAural.state.makeClip.show.set(true)
}

const makeClipSuccessModalHide = () => {
  OmniAural.state.makeClip.successModalShow.set(false)
}

const makeClipSuccessModalShow = () => {
  OmniAural.state.makeClip.successModalShow.set(true)
}

const makeClipSuccessModalSetLinkUrl = (url: string) => {
  OmniAural.state.makeClip.successModalLinkUrl.set(url)
}

OmniAural.addActions({ makeClipClearState, makeClipHide, makeClipSetEndTime,
  makeClipSetIsPublic, makeClipSetStartTime, makeClipSetTitle, makeClipShow,
  makeClipSetClipFlagPositions, makeClipSetHighlightedPositions,
  makeClipSuccessModalHide, makeClipSuccessModalShow, makeClipSuccessModalSetLinkUrl,
  makeClipShowEditing })
