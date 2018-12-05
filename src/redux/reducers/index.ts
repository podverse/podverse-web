import { combineReducers } from 'redux'
import mediaPlayer from '~/redux/reducers/mediaPlayer'
import modals from '~/redux/reducers/modals'
import page from '~/redux/reducers/page'
import playerQueue from '~/redux/reducers/playerQueue'
import user from '~/redux/reducers/user'

export default combineReducers({
  mediaPlayer,
  modals,
  page,
  playerQueue,
  user
})
