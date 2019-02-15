import { actionTypes } from '~/redux/constants'

export const settingsHideNSFWMode = payload => {
  return {
    type: actionTypes.SETTINGS_SET_HIDE_NSFW_MODE,
    payload
  }
}

export const settingsHideUITheme = payload => {
  return {
    type: actionTypes.SETTINGS_SET_HIDE_UI_THEME,
    payload
  }
}

export const settingsHideFilterButton = payload => {
  return {
    type: actionTypes.SETTINGS_SET_HIDE_FILTER_BUTTON,
    payload
  }
}

export const settingsSetNSFWMode = payload => {
  return {
    type: actionTypes.SETTINGS_SET_NSFW_MODE,
    payload
  }
}

export const settingsSetUITheme = payload => {
  return {
    type: actionTypes.SETTINGS_SET_UI_THEME,
    payload
  }
}
