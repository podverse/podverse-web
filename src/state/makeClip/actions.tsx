import OmniAural from "omniaural"

/* Time parameters should be in hh:mm:ss string format */

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

OmniAural.addActions({ makeClipHide, makeClipSetEndTime, makeClipSetIsPublic,
  makeClipSetStartTime, makeClipSetTitle, makeClipShow })
