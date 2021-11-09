import type { Podcast } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { PV } from '~/resources'
import { ButtonRectangle, PVImage } from '..'

type Props = {
  podcast: Podcast
}

export const PodcastPageHeader = ({ podcast }: Props) => {
  const { t } = useTranslation()
  const { imageUrl } = podcast

  return (
    <div
      className='podcast-page-header'>
      <div className='main-max-width'>
        <PVImage
          alt={t('Podcast artwork')}
          height={PV.Images.sizes.large}
          src={imageUrl}
          width={PV.Images.sizes.large}
        />
        <div className='text-wrapper'>
          <h1>{podcast.title}</h1>
          <div className='sub-text'>
            host name + categories
          </div>
        </div>
        <ButtonRectangle
          label={t('Subscribe')}
          type='tertiary' />
      </div>
    </div>
  )
}
