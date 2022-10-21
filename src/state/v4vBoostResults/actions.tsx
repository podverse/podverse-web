import OmniAural from 'omniaural'
import { V4VBoostResults } from '../omniauralState'

const v4vSetBoostResults = (v4vBoostResults: V4VBoostResults) => {
  OmniAural.state.v4vBoostResults.set(v4vBoostResults)
}

const v4vShowBoostResultsModal = (bool: boolean) => {
  OmniAural.state.v4vBoostResults.set(bool)
}

OmniAural.addActions({ v4vSetBoostResults, v4vShowBoostResultsModal })
