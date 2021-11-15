import OmniAural from "omniaural"

const setUserInfo = (userInfo: any) => {
  OmniAural.state.session.userInfo.set(userInfo)
}

OmniAural.addActions(
  setUserInfo
)
