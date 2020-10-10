import { cleanNowPlayingItem } from "podverse-shared"
import { actionTypes } from "~/redux/constants"

export const mediaPlayerLoadNowPlayingItem = payload => {
  const cleanedNowPlayingItem = cleanNowPlayingItem(payload)

  return {
    type: actionTypes.MEDIA_PLAYER_LOAD_NOW_PLAYING_ITEM,
    payload: cleanedNowPlayingItem
  }
}

export const mediaPlayerUpdatePlaying = payload => {
  return {
    type: actionTypes.MEDIA_PLAYER_UPDATE_PLAYING,
    payload
  }
}

export const mediaPlayerSetClipFinished = payload => {
  return {
    type: actionTypes.MEDIA_PLAYER_SET_CLIP_FINISHED,
    payload
  }
}

export const mediaPlayerSetPlayedAfterClipFinished = payload => {
  return {
    type: actionTypes.MEDIA_PLAYER_SET_PLAYED_AFTER_CLIP_FINISHED,
    payload
  }
}
