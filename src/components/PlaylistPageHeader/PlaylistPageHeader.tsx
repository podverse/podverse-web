import { useOmniAural } from 'omniaural'
import type { Playlist } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { toggleSubscribeToPlaylistOnServer } from '~/services/playlist'
import { ButtonRectangle } from '..'

type Props = {
  handleStartEditing: any
  handleStopEditing: any
  isEditing?: boolean
  playlist: Playlist
}

export const PlaylistPageHeader = ({ handleStartEditing, handleStopEditing,
  isEditing, playlist }: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')
  const title = playlist?.title || t('untitledPlaylist')
  const ownerName = playlist?.owner?.name || t('Anonymous')
  const itemCount = playlist?.itemCount || 0
  const isLoggedInUserPlaylist = userInfo?.id && userInfo.id === playlist?.owner?.id
  const isSubscribed = userInfo?.subscribedPodcastIds?.includes(playlist.id)
  const subscribedText = isSubscribed ? t('Unsubscribe') : t('Subscribe')
  const editButtonText = isEditing ? t('Done') : t('Edit')
  const handleToggleEditButton = isEditing ? handleStopEditing : handleStartEditing

  return (
    <div
      className='playlist-page-header'>
      <div className='main-max-width'>
        <div className='text-wrapper'>
          <h1>{title}</h1>
          <div className='items-count'>{`${t('Items')}: ${itemCount}`}</div>
          {
            !isLoggedInUserPlaylist && (
              <div className='owner-name'>{`${t('Created by')}: ${ownerName}`}</div>
            )
          }
        </div>
        {
          isLoggedInUserPlaylist && (
            <ButtonRectangle
              label={editButtonText}
              onClick={() => handleToggleEditButton(playlist.id)}
              type='tertiary' />
          )
        }
        {
          !isLoggedInUserPlaylist && (
            <ButtonRectangle
              label={subscribedText}
              onClick={() => toggleSubscribeToPlaylistOnServer(playlist.id)}
              type='tertiary' />
          )
        }
      </div>
    </div>
  )
}
