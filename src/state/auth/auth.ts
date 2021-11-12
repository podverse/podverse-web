import OmniAural from "omniaural"
import { getAuthenticatedUserInfo as getAuthenticatedUserInfoService } from "~/services/auth"

export const refreshAuthenticatedUserInfoState = async (bearerToken?: string) => {
  const userInfo = await getAuthenticatedUserInfoService(bearerToken)
  OmniAural.state.session.userInfo.set(userInfo)
}
