import OmniAural from 'omniaural'

const pageIsLoadingHide = () => {
  OmniAural.state.page.isLoading.set(false)
}

const pageIsLoadingShow = () => {
  OmniAural.state.page.isLoading.set(true)
}

OmniAural.addActions({ pageIsLoadingHide, pageIsLoadingShow })
