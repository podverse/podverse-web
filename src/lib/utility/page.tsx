import { SSRConfig } from "next-i18next"
import { ClientSideCookies } from "./cookies"

type I18nPage = SSRConfig

export interface Page extends I18nPage {
  serverUserInfo: any
  serverCookies: ClientSideCookies
}
