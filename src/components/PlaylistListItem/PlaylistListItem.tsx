import { Playlist } from 'podverse-shared'
import { useOmniAural } from 'omniaural'
import { useTranslation } from 'react-i18next'
import { PVLink } from '..'
import { PV } from '~/resources'

type Props = {
  playlist: Playlist
}

export const PlaylistListItem = ({ playlist }: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')
  const title = playlist?.title ? playlist.title : t('untitledPlaylist')
  const isLoggedInUserPlaylist = userInfo?.id && userInfo.id === playlist?.owner?.id
  const ownerName = playlist?.owner?.name || t('Anonymous')
  const itemCount = playlist?.itemCount || 0
  const playlistPageUrl = `${PV.RoutePaths.web.playlist}/${playlist.id}`

  return (
    <>
      <li className='playlist-list-item'>
        <PVLink href={playlistPageUrl}>
          <div className='title'>{title}</div>
          <div className='items-count'>{`${t('Items')}: ${itemCount}`}</div>
          {
            !isLoggedInUserPlaylist && (
              <div className='owner-name'>{`${t('Created by')}: ${ownerName}`}</div>
            )
          }
        </PVLink>
      </li>
      <hr />
    </>
  )
}
