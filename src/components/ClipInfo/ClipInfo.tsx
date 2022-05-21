import { useOmniAural } from 'omniaural'
import { Episode, MediaRef } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { MediaItemControls, PVImage } from '~/components'
import { getClipTitle } from '~/lib/utility/misc'
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
  const title = getClipTitle(t, mediaRef.title, episode.title)

  return (
    <div className='clip-info'>
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
