import { actionTypes } from "~/redux/constants";

export const mediaPlayerLoadNowPlayingItem = payload => {
  return {
    type: actionTypes.MEDIA_PLAYER_LOAD_NOW_PLAYING_ITEM,
    payload
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
