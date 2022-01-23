import OmniAural from 'omniaural'

const modalsFundingHide = () => {
  OmniAural.state.modals.funding.show.set(false)
}

const modalsFundingShow = (fundingLinks: any[]) => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.funding.fundingLinks.set(fundingLinks)
  OmniAural.state.modals.funding.show.set(true)
}

OmniAural.addActions({ modalsFundingHide, modalsFundingShow })
