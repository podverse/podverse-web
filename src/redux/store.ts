import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import reducers from 'redux/reducers'

export const initializeStore = () => {
  return createStore(reducers, {}, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}