import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PV } from '~/resources'
import { getServerSideAuthenticatedUserInfo } from '~/services/auth'
import { getServerSideUserQueueItems } from '~/services/userQueueItem'
import { getServerSideHistoryItemsIndex } from '~/services/userHistoryItem'

export const getDefaultServerSideProps = async (ctx: any, locale: any) => {
  const serverCookies = ctx.req.cookies || {}

  const [serverHistoryItemsIndex, serverUserInfo, serverUserQueueItems] = await Promise.all([
    getServerSideHistoryItemsIndex(serverCookies),
    getServerSideAuthenticatedUserInfo(serverCookies),
    getServerSideUserQueueItems(serverCookies)
  ])

  const serverGlobalFiltersString = serverCookies.globalFilters
  type GlobalFilters = {
    videoOnlyMode: boolean
  }
  let serverGlobalFilters: GlobalFilters = { videoOnlyMode: false }
  if (serverGlobalFiltersString) {
    try {
      serverGlobalFilters = JSON.parse(serverGlobalFiltersString)
    } catch (err) {
      // do nothing
    }
  }

  return {
    serverCookies,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
    serverGlobalFilters,
    serverHistoryItemsIndex,
    serverUserInfo,
    serverUserQueueItems
  }
}
