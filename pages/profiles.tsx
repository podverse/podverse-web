import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import OmniAural, { useOmniAural } from 'omniaural'
import type { User } from 'podverse-shared'
import { List, MessageWithAction, Meta, PageHeader, PageScrollableContent, Pagination, PlaylistListItem, scrollToTopOfPageScrollableContent } from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getServerSideAuthenticatedUserInfo } from '~/services/auth'
import { getPublicUsersByQuery } from '~/services/user'
import { getServerSideUserQueueItems } from '~/services/userQueueItem'
import { ProfileListItem } from '~/components/ProfileListItem/ProfileListItem'
import { useEffect, useRef, useState } from 'react'

interface ServerProps extends Page {
  serverFilterPage: number
  serverUsers: User[]
  serverUsersCount: number
}

const keyPrefix = 'pages_profiles'

export default function Profiles({ serverFilterPage, serverUsers,
  serverUsersCount }: ServerProps) {

  /* Initialize */

  const { t } = useTranslation()
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [usersListData, setUsersListData] = useState<User[]>(serverUsers)
  const [userInfo] = useOmniAural('session.userInfo')
  const initialRender = useRef(true)
  const pageCount = Math.ceil(serverUsersCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  
  /* useEffects */

  useEffect(() => {
    (async () => {
      if (initialRender.current) {
        initialRender.current = false;
      } else {
        OmniAural.pageIsLoadingShow()
        const [newListData, newListCount] = await clientQueryUsers()
        setUsersListData(newListData)
        scrollToTopOfPageScrollableContent()
        OmniAural.pageIsLoadingHide()
      }
    })()
  }, [filterPage])

  /* Client-Side Queries */

  const clientQueryUsers = async () => {
    let response: any = [[], 0]
    if (userInfo?.subscribedUserIds) {
      const page = filterPage || 1
      response = await getPublicUsersByQuery(page, userInfo.subscribedUserIds)
    }

    return response
  }

  /* Render Helpers */

  const generateProfileElements = (listItems: User[]) => {
    return listItems.map((listItem, index) =>
      <ProfileListItem
        key={`${keyPrefix}-${index}`}
        user={listItem} />
    )
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.profiles}`,
    description: t('pages:profiles._Description'),
    title: t('pages:profiles._Title')
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title} />
      <PageHeader text={t('Profiles')} />
      <PageScrollableContent noMarginTop>
        {
          !userInfo && (
            <MessageWithAction
              actionLabel={t('Login')}
              actionOnClick={() => OmniAural.modalsLoginShow()}
              message={t('LoginToViewYourProfiles')} />
          )
        }
        {
          userInfo && (
            <>
              <List>
                {generateProfileElements(usersListData)}
              </List>
              <Pagination
                currentPageIndex={filterPage}
                handlePageNavigate={(newPage) => setFilterPage(newPage)}
                handlePageNext={() => { if (filterPage + 1 <= pageCount) setFilterPage(filterPage + 1) }}
                handlePagePrevious={() => { if (filterPage - 1 > 0) setFilterPage(filterPage - 1) }}
                pageCount={pageCount} />
            </>
          )
        }
        </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  const userInfo = await getServerSideAuthenticatedUserInfo(cookies)
  const userQueueItems = await getServerSideUserQueueItems(cookies)

  let response: any = [[], 0]
  const page = 1
  if (userInfo?.subscribedUserIds) {
    response = await getPublicUsersByQuery(page, userInfo.subscribedUserIds)
  }

  const [users, usersCount] = response

  const serverProps: ServerProps = {
    serverUserInfo: userInfo,
    serverUserQueueItems: userQueueItems,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
    serverCookies: cookies,
    serverFilterPage: page,
    serverUsers: users,
    serverUsersCount: usersCount
  }

  return { props: serverProps }
}
