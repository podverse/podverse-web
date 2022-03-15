import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Footer, PageHeader, PageScrollableContent, SideContent, TextInput } from '~/components'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { addOrUpdateFeedFromPodcastIndex, parseFeedByPodcastId } from '~/services/admin'

type ServerProps = Page

export default function Admin(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [parseFeedByPodcastIdValue, setParseFeedByPodcastIdValue] = useState<string>('')
  const [parseFeedByPodcastIdIsLoading, setParseFeedByPodcastIdIsLoading] = useState<boolean>(false)
  const [addOrUpdateFeedFromPodcastIndexValue, setAddOrUpdateFeedFromPodcastIndexValue] = useState<string>('')
  const [addOrUpdateFeedFromPodcastIndexIsLoading, setAddOrUpdateFeedFromPodcastIndexIsLoading] =
    useState<boolean>(false)

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.admin}`,
    description: t('pages-admin_Description'),
    title: t('pages-admin_Title')
  }

  const handleParseFeedByPodcastIdOnChange = (value) => {
    setParseFeedByPodcastIdValue(value)
  }

  const handleParseFeedByPodcastIdSubmit = async () => {
    setParseFeedByPodcastIdIsLoading(true)
    try {
      const response = await parseFeedByPodcastId(parseFeedByPodcastIdValue)
      alert(response.message)
    } catch (error) {
      alert(error.message)
    }
    setParseFeedByPodcastIdIsLoading(false)
  }

  const handleAddOrUpdateFeedFromPodcastIndexOnChange = (value) => {
    setAddOrUpdateFeedFromPodcastIndexValue(value)
  }

  const handleAddOrUpdateFeedFromPodcastIndexSubmit = async () => {
    setAddOrUpdateFeedFromPodcastIndexIsLoading(true)
    try {
      const response = await addOrUpdateFeedFromPodcastIndex(addOrUpdateFeedFromPodcastIndexValue)
      const alertMessage = `${response.message} - ${response.podcastId}`
      alert(alertMessage)
    } catch (error) {
      alert(error.message)
    }
    setParseFeedByPodcastIdIsLoading(false)
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
      <PageHeader text={t('Admin Tools')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <h3>{t('Parse feed')}</h3>
              <TextInput
                endButtonIsLoading={parseFeedByPodcastIdIsLoading}
                endButtonText={t('Submit')}
                handleEndButtonClick={handleParseFeedByPodcastIdSubmit}
                label='podcast id'
                onChange={(value: string) => {
                  handleParseFeedByPodcastIdOnChange(value)
                }}
                onSubmit={handleParseFeedByPodcastIdSubmit}
                placeholder='podcast id'
                type='text'
                value={parseFeedByPodcastIdValue}
              />
              <h3>{t('Add or update feed from Podcast Index')}</h3>
              <TextInput
                endButtonIsLoading={addOrUpdateFeedFromPodcastIndexIsLoading}
                endButtonText={t('Submit')}
                handleEndButtonClick={handleAddOrUpdateFeedFromPodcastIndexSubmit}
                label='podcast index id'
                onChange={(value: string) => {
                  handleAddOrUpdateFeedFromPodcastIndexOnChange(value)
                }}
                onSubmit={handleAddOrUpdateFeedFromPodcastIndexSubmit}
                placeholder='podcast index id'
                type='text'
                value={addOrUpdateFeedFromPodcastIndexValue}
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
