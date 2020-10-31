import { actionTypes } from '~/redux/constants'

export const settingsCensorNSFWText = payload => {
  return {
    type: actionTypes.SETTINGS_CENSOR_NSFW_TEXT,
    payload
  }
}

export const settingsSetDefaultHomepageTab = payload => {
  return {
    type: actionTypes.SETTINGS_SET_DEFAULT_HOMEPAGE_TAB,
    payload
  }
}

export const settingsHidePlaybackSpeedButton = payload => {
  return {
    type: actionTypes.SETTINGS_SET_HIDE_PLAYBACK_SPEED_BUTTON,
    payload
  }
}

export const settingsHideTimeJumpBackwardButton = payload => {
  return {
    type: actionTypes.SETTINGS_SET_HIDE_TIME_JUMP_BACKWARD_BUTTON,
    payload
  }
}

export const settingsSetUITheme = payload => {
  return {
    type: actionTypes.SETTINGS_SET_UI_THEME,
    payload
  }
}
