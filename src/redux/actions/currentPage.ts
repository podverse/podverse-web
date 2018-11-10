import { actionTypes } from "~/redux/constants";

export const currentPageLoadEpisode = payload => {
  return {
    type: actionTypes.CURRENT_PAGE_LOAD_EPISODE,
    payload
  }
}

export const currentPageLoadMediaRef = payload => {
  return {
    type: actionTypes.CURRENT_PAGE_LOAD_MEDIA_REF,
    payload
  }
}

export const currentPageLoadNowPlayingItem = payload => {
  return {
    type: actionTypes.CURRENT_PAGE_LOAD_NOW_PLAYING_ITEM,
    payload
  }
}

export const currentPageLoadPodcast = payload => {
  return {
    type: actionTypes.CURRENT_PAGE_LOAD_PODCAST,
    payload
  }
}
