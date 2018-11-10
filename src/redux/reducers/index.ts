import { combineReducers } from 'redux'
import currentPage from '~/redux/reducers/currentPage'
import mediaPlayer from '~/redux/reducers/mediaPlayer'
import playerQueue from '~/redux/reducers/playerQueue'

export default combineReducers({
  currentPage,
  mediaPlayer,
  playerQueue
})
