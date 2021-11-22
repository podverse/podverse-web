import { PV } from "~/resources"

type Props = {}

export const DownloadAppButtons = () => {
  return (
    <div className='download-app-buttons'>
      <a
        className="download-on-the-app-store no-radius"
        href={PV.Config.APP_DOWNLOAD_ON_THE_APP_STORE_URL} />
      <a
        className="get-it-on-google-play no-radius"
        href={PV.Config.APP_GET_IT_ON_GOOGLE_PLAY_URL}>
        <img
          alt='Get it on Google Play'
          src={PV.RoutePaths.web.googlePlayStoreBadge} />
      </a>
      <a
        className='get-it-on-fdroid no-radius'
        href={PV.Config.APP_GET_IT_ON_FDROID_URL}
        rel='noopener noreferrer'
        target='_blank' />
    </div>
  )
}
