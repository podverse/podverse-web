import { useOmniAural } from 'omniaural'
import { Episode, MediaRef } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { MediaItemControls, PVImage, PVLink } from '~/components'
import { readableDate } from '~/lib/utility/date'
import { getClipTitle, getEpisodeTitle } from '~/lib/utility/misc'
import { PV } from '~/resources'
import { OmniAuralState } from '~/state/omniauralState'

type Props = {
  episode: Episode
  includeMediaItemControls?: boolean
  mediaRef: MediaRef
}

export const ClipInfo = ({ episode, mediaRef }: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const episodeTitle = getEpisodeTitle(t, episode)
  const episodePubDate = readableDate(episode.pubDate)
  const title = getClipTitle(t, mediaRef.title, episode.title)

  const episodeLinkUrl = episode ? `${PV.RoutePaths.web.episode}/${episode.id}` : ''

  return (
    <div className='clip-info'>
      <div className='episode-title'>
        <PVLink href={episodeLinkUrl}>{episodeTitle}</PVLink>
      </div>
      <div className='episode-pub-date'>{episodePubDate}</div>
      <div className='clip-inner-wrapper'>
        {mediaRef.imageUrl && (
          <PVImage
            alt=''
            height={PV.Images.sizes.fullViewAudio}
            src={mediaRef.imageUrl}
            width={PV.Images.sizes.fullViewAudio}
          />
        )}
        <div className='clip-text-wrapper'>
          <div className='clip-title'>{title}</div>
          <MediaItemControls
            buttonSize='large'
            episode={episode}
            hidePubDate
            isLoggedInUserMediaRef={userInfo && userInfo.id === mediaRef.owner.id}
            mediaRef={mediaRef}
            podcast={episode.podcast}
          />
        </div>
      </div>

      <hr />
    </div>
  )
}
