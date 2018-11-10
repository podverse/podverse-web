import { actionTypes } from "~/redux/constants";

export const mediaPlayerLoadNowPlayingItem = payload => {
  return {
    type: actionTypes.MEDIA_PLAYER_LOAD_NOW_PLAYING_ITEM,
    payload
  }
}