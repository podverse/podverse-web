import { combineReducers } from 'redux'
import isPageLoading from '~/redux/reducers/isPageLoading'
import mediaPlayer from '~/redux/reducers/mediaPlayer'
import modals from '~/redux/reducers/modals'
import playerQueue from '~/redux/reducers/playerQueue'
import user from '~/redux/reducers/user'

export default combineReducers({
  isPageLoading,
  mediaPlayer,
  modals,
  playerQueue,
  user
})
