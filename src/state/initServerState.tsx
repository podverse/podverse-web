import OmniAural from 'omniaural'
import initialState from "~/state/initialState.json"

export const initServerState = () => {
  OmniAural.initGlobalState(initialState)
}
