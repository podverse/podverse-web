import { useOmniAural } from 'omniaural'
import { Episode, MediaRef } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { MediaItemControls, PVLink } from '~/components'
import { readableDate } from '~/lib/utility/date'
import { getClipTitle, getEpisodeTitle } from '~/lib/utility/misc'
import { PV } from '~/resources'
import { OmniAuralState } from '~/state/omniauralState'

type Props = {
  clip: MediaRef
  episode: Episode
  includeMediaItemControls?: boolean
}

export const ClipInfo = ({ clip, episode }: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const episodeTitle = getEpisodeTitle(t, episode)
  const episodePubDate = readableDate(episode.pubDate)
  const title = getClipTitle(t, clip.title, episode.title)

  const episodeLinkUrl = episode ? `${PV.RoutePaths.web.episode}/${episode.id}` : ''

  return (
    <div className='clip-info'>
      <div className='episode-title'>
        <PVLink href={episodeLinkUrl}>{episodeTitle}</PVLink>
      </div>
      <div className='episode-pub-date'>{episodePubDate}</div>
      <div className='clip-title'>{title}</div>
      <MediaItemControls
        buttonSize='large'
        clip={clip}
        episode={episode}
        hidePubDate
        isLoggedInUserMediaRef={userInfo && userInfo.id === clip.owner.id}
        podcast={episode.podcast}
      />
      <hr />
    </div>
  )
}
