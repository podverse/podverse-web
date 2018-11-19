import { combineReducers } from 'redux'
import currentPage from '~/redux/reducers/currentPage'
import mediaPlayer from '~/redux/reducers/mediaPlayer'
import modals from '~/redux/reducers/modals'
import playerQueue from '~/redux/reducers/playerQueue'
import user from '~/redux/reducers/user'

export default combineReducers({
  currentPage,
  mediaPlayer,
  modals,
  playerQueue,
  user
})
