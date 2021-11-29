import OmniAural from "omniaural"

/* Time parameters should be in hh:mm:ss string format */

const makeClipSetClipFlagPositions = (clipFlagPositions: number[]) => {
  OmniAural.state.makeClip.clipFlagPositions.set(clipFlagPositions)
}

const makeClipSetHighlightedPositions = (highlightedPositions: number[]) => {
  OmniAural.state.makeClip.highlightedPositions.set(highlightedPositions)
}

const makeClipHide = () => {
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

const makeClipSuccessModalHide = () => {
  OmniAural.state.makeClip.successModalShow.set(false)
}

const makeClipSuccessModalShow = () => {
  OmniAural.state.makeClip.successModalShow.set(true)
}

const makeClipSuccessModalSetLinkUrl = (url: string) => {
  OmniAural.state.makeClip.successModalLinkUrl.set(url)
}

OmniAural.addActions({ makeClipHide, makeClipSetEndTime, makeClipSetIsPublic,
  makeClipSetStartTime, makeClipSetTitle, makeClipShow,
  makeClipSetClipFlagPositions, makeClipSetHighlightedPositions,
  makeClipSuccessModalHide, makeClipSuccessModalShow, makeClipSuccessModalSetLinkUrl })
