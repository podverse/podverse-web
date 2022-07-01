import { SSRConfig } from 'next-i18next'
import { NowPlayingItem } from 'podverse-shared'
import { ClientSideCookies } from './cookies'

export type I18nPage = SSRConfig

export interface Page extends I18nPage {
  serverUserInfo: any
  serverUserQueueItems: NowPlayingItem[]
  serverCookies: ClientSideCookies
  serverGlobalFilters: any
}
