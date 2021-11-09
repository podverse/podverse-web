import OmniAural from "omniaural"
import { getAuthenticatedUserInfo as getAuthenticatedUserInfoService } from "~/services/auth"

export const refreshAuthenticatedUserInfoState = async () => {
  const userInfo = await getAuthenticatedUserInfoService()
  OmniAural.state.session.userInfo.set(userInfo)
}
