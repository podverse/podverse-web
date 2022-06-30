import { useOmniAural } from 'omniaural'
import { PVImage } from '~/components'
import { readableDate } from '~/lib/utility/date'
import { PV } from '~/resources'
import { OmniAuralState } from '~/state/omniauralState'

export const EmbedPlayerHeader = () => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { currentNowPlayingItem } = player
  const pubDate = currentNowPlayingItem?.episodePubDate && readableDate(new Date(currentNowPlayingItem.episodePubDate))
  
  return (
    <div className='embed-player-header'>
      <div className='embed-player-header-image'>
        <PVImage
          alt=''
          height={PV.Images.sizes.embed}
          src={currentNowPlayingItem?.episodeImageUrl || currentNowPlayingItem?.podcastImageUrl}
          width={PV.Images.sizes.embed}
        />
      </div>
      <div className='embed-player-header-inner'>
        <div className='embed-player-header-top'>
          <div className='embed-player-header-top-text'>
            {currentNowPlayingItem?.podcastTitle}
          </div>
          <div className='embed-player-header-middle-text'>
            {currentNowPlayingItem?.episodeTitle}
          </div>
          <div className='embed-player-header-bottom-text'>
            {pubDate}
          </div>
        </div>
      </div>
    </div>
  )
}
