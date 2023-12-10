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
    serverCookies: serverCookies ?? null,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.common as any)),
    serverGlobalFilters: serverGlobalFilters ?? null,
    serverHistoryItemsIndex: serverHistoryItemsIndex ?? null,
    serverUserInfo: serverUserInfo ?? null,
    serverUserQueueItems: serverUserQueueItems ?? null
  }
}

export const getDefaultEmbedServerSideProps = async (ctx: any, locale: any) => {
  return {
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.common as any))
  }
}

export const getServerSidePropsWrapper = async (getServerSideProps) => {
  let serverProps = null
  try {
    serverProps = await getServerSideProps()
  } catch (error) {
    if (error?.response?.status === 404) {
      serverProps = {
        notFound: true
      }
    } else {
      throw (error)
    }
  }
  return serverProps
}
