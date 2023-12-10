import { useTranslation } from 'next-i18next'
import { PV } from '~/resources'

type Props = {
  hideFDroid?: boolean
}

export const DownloadAppButtons = (props: Props) => {
  const { t } = useTranslation()
  return (
    <div className='download-app-buttons'>
      <a
        aria-label={t('Download on the App Store')}
        className='download-badge-download-on-the-app-store no-radius'
        href={PV.Config.APP_DOWNLOAD_ON_THE_APP_STORE_URL}
      />
      <a
        aria-label={t('Download on the Google Play Store')}
        className='download-badge-get-it-on-google-play no-radius'
        href={PV.Config.APP_GET_IT_ON_GOOGLE_PLAY_URL}
      >
        <img alt='' src={PV.RoutePaths.web.googlePlayStoreBadge} />
      </a>
      {
        !props.hideFDroid && (
          <a
            aria-label={t('Download on the F-Droid Store')}
            className='download-badge-get-it-on-fdroid no-radius'
            href={PV.Config.APP_GET_IT_ON_FDROID_URL}
            rel='noopener noreferrer'
            target='_blank'
          />
        )
      }
    </div>
  )
}
