/*
  This page exists because iOS React Native does not handle a URL with
  # symbols without converting them to %23, which is invalid for the Matrix space link.
*/

import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Meta } from '~/components'

type ServerProps = Page

export default function TrackRedirect(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.track}`,
    description: t('pages-about_Description'),
    title: t('pages-about_Title')
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
        twitterTitle={meta.title}
      />
      <p>redirecting...</p>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params } = ctx
  const { trackId } = params

  return {
    redirect: {
      destination: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episode}/${trackId}`,
      permanent: false
    }
  }
}
