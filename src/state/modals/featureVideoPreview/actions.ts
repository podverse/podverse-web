import OmniAural from 'omniaural'

const modalsFeatureVideoPreviewHide = () => {
  OmniAural.state.modals.featureVideoPreview.videoEmbedData.set(null)
}

const modalsFeatureVideoPreviewShow = (videoEmbedData: any) => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.featureVideoPreview.videoEmbedData.set(videoEmbedData)
}

OmniAural.addActions({ modalsFeatureVideoPreviewHide, modalsFeatureVideoPreviewShow })
