import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Footer, PageHeader, PageScrollableContent, SideContent, TextInput } from '~/components'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { sendPodpingLiveStatusUpdate } from '~/services/podpingAdmin'

type ServerProps = Page

export default function PodpingAdmin(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [sendPodpingLiveStatusUpdateFeedUrl, setSendPodpingLiveStatusUpdateFeedUrl] = useState<string>('')
  const [sendPodpingLiveStatusUpdateFeedUrlIsLoading, setSendPodpingLiveStatusUpdateFeedUrlIsLoading] = useState<boolean>(false)

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.admin}`,
    description: t('pages-podping-admin_Description'),
    title: t('pages-podping-admin_Title')
  }

  const handleSendPodpingLiveStatusUpdateOnChange = (value) => {
    setSendPodpingLiveStatusUpdateFeedUrl(value)
  }

  const handleSendPodpingLiveStatusUpdateSubmit = async () => {
    setSendPodpingLiveStatusUpdateFeedUrlIsLoading(true)
    try {
      const response = await sendPodpingLiveStatusUpdate(sendPodpingLiveStatusUpdateFeedUrl)
      alert(response.message)
    } catch (error) {
      alert(error.message)
    }
    setSendPodpingLiveStatusUpdateFeedUrlIsLoading(false)
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={true}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PageHeader text={t('Podping Admin Tools')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <h3>{t('Send Podping livestream updated notification')}</h3>
              <TextInput
                endButtonIsLoading={sendPodpingLiveStatusUpdateFeedUrlIsLoading}
                endButtonText={t('Submit')}
                handleEndButtonClick={handleSendPodpingLiveStatusUpdateSubmit}
                label={t('RSS Feed URL')}
                onChange={(value: string) => {
                  handleSendPodpingLiveStatusUpdateOnChange(value)
                }}
                onSubmit={handleSendPodpingLiveStatusUpdateSubmit}
                placeholder={t('RSS Feed URL')}
                type='text'
                value={sendPodpingLiveStatusUpdateFeedUrl}
              />
            </div>
          }
          sideColumnChildren={<SideContent />}
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)

  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}
