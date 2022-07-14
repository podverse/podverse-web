import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ButtonRectangle,
  ColumnsWrapper,
  Footer,
  PageHeader,
  PageScrollableContent,
  SideContent,
  TextInput
} from '~/components'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { sendPodpingLiveStatusUpdate } from '~/services/podpingAdmin'

type ServerProps = Page

export default function PodpingAdmin(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [sendPodpingLiveStatusUpdateFeedUrl, setSendPodpingLiveStatusUpdateFeedUrl] = useState<string>('')
  const [startLiveStatusUpdateIsLoading, setStartLiveStatusUpdateIsLoading] = useState<boolean>(false)
  const [endLiveStatusUpdateIsLoading, setEndLiveStatusUpdateIsLoading] = useState<boolean>(false)

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.admin}`,
    description: t('pages-about_Description'),
    title: t('pages-podping-admin_Title')
  }

  const handleSendPodpingLiveStatusUpdateOnChange = (value) => {
    setSendPodpingLiveStatusUpdateFeedUrl(value)
  }

  const handleSendPodpingLiveStatusUpdateSubmit = async (status: 'live' | 'liveEnd') => {
    try {
      if (status === 'live') {
        setStartLiveStatusUpdateIsLoading(true)
      } else if (status === 'liveEnd') {
        setEndLiveStatusUpdateIsLoading(true)
      }
      const response = await sendPodpingLiveStatusUpdate(sendPodpingLiveStatusUpdateFeedUrl, status)
      alert(response.message)
    } catch (error) {
      alert(error.message)
    }
    setStartLiveStatusUpdateIsLoading(false)
    setEndLiveStatusUpdateIsLoading(false)
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
              <h3>{t('Send Podping live status notification')}</h3>
              <TextInput
                handleEndButtonClick={handleSendPodpingLiveStatusUpdateSubmit}
                label={t('RSS Feed URL')}
                onChange={(value: string) => {
                  handleSendPodpingLiveStatusUpdateOnChange(value)
                }}
                placeholder={t('RSS Feed URL')}
                type='text'
                value={sendPodpingLiveStatusUpdateFeedUrl}
              />
              <div className='button-row-below-text-input'>
                <ButtonRectangle
                  isSuccess
                  isLoading={startLiveStatusUpdateIsLoading}
                  label={t('Start livestream')}
                  onClick={() => handleSendPodpingLiveStatusUpdateSubmit('live')}
                  type='primary'
                />
                <ButtonRectangle
                  isDanger
                  isLoading={endLiveStatusUpdateIsLoading}
                  label={t('End livestream')}
                  onClick={() => handleSendPodpingLiveStatusUpdateSubmit('liveEnd')}
                  type='primary'
                />
              </div>
              <p>{`Step 1: Update and publish your RSS feed with your new liveItem status.`}</p>
              <p>{`Step 2: Copy and paste your RSS feed URL into the input above.`}</p>
              <p>{`Step 3: Press either "Start livestream" or "End livestream"`}</p>
              <p>{`It takes ~15 seconds for the Podping notification to send, and then it may take 1-2 minutes before Podverse updates with the latest live status.`}</p>
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
