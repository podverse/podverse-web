import { actionTypes } from '~/redux/constants'

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
