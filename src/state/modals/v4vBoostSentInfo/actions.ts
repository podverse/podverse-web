import OmniAural from 'omniaural'

const modalsV4VBoostSentInfoShow = () => {
  OmniAural.state.modals.v4vBoostSentInfo.show.set(true)
}

const modalsV4VBoostSentInfoHide = () => {
  OmniAural.state.modals.v4vBoostSentInfo.show.set(false)
}

OmniAural.addActions({
  modalsV4VBoostSentInfoShow,
  modalsV4VBoostSentInfoHide
})
