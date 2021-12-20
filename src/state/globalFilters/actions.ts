import OmniAural from 'omniaural'

const setGlobalFiltersVideoOnlyMode = (val: boolean) => {
  OmniAural.state.globalFilters.videoOnlyMode.set(val)
}

OmniAural.addActions({ setGlobalFiltersVideoOnlyMode })
