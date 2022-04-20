import { useRouter } from 'next/router'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Playlist } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonRectangle, TextInput } from '~/components'
import { deletePlaylistOnServer } from '~/services/playlist'
import { toggleSubscribeToPlaylist } from '~/state/loggedInUserActions'
import { OmniAuralState } from '~/state/omniauralState'

type Props = {
  handleChangeIsPublic?: any
  handleEditCancel: any
  handleEditSave: any
  handleEditStart: any
  handlePlaylistTitleOnChange: any
  isEditing?: boolean
  playlist: Playlist
}

export const PlaylistPageHeader = ({
  handleEditCancel,
  handleEditSave,
  handleEditStart,
  handlePlaylistTitleOnChange,
  isEditing,
  playlist
}: Props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const [, setIsDeleting] = useState<boolean>(false)
  const title = playlist?.title || t('untitledPlaylist')
  const ownerName = playlist?.owner?.name || t('Anonymous')
  const itemCount = playlist?.itemCount || 0
  const isLoggedInUserPlaylist = userInfo?.id && userInfo.id === playlist?.owner?.id
  const isSubscribed = userInfo?.subscribedPodcastIds?.includes(playlist.id)
  const subscribedText = isSubscribed ? t('Unsubscribe') : t('Subscribe')
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)

  /* Function Helpers */

  const handleDeletePlaylistOnServer = async () => {
    const shouldDelete = window.confirm(t('Are you sure you want to delete this playlist'))
    if (shouldDelete) {
      setIsDeleting(true)
      OmniAural.pageIsLoadingShow()
      await deletePlaylistOnServer(playlist.id)
      setIsDeleting(false)
      OmniAural.pageIsLoadingHide()
      router.push('/playlists')
    }
  }

  const _toggleSubscribeToPlaylist = async () => {
    setIsSubscribing(true)
    await toggleSubscribeToPlaylist(playlist.id, t)
    setIsSubscribing(false)
  }

  return (
    <>
      <div className='playlist-page-header'>
        <div className='main-max-width'>
          <div className='text-wrapper'>
            {isEditing ? (
              <TextInput
                defaultValue={playlist.title}
                label={t('Playlist Title')}
                noMarginOrPadding
                onChange={handlePlaylistTitleOnChange}
                onSubmit={handleEditSave}
                placeholder={t('Playlist Title')}
                type='text'
              />
            ) : (
              <h1 tabIndex={0}>{title}</h1>
            )}
            {!isEditing && <div className='items-count' tabIndex={0}>{`${t('Items')}: ${itemCount}`}</div>}
            {!isLoggedInUserPlaylist && (
              <div className='owner-name' tabIndex={0}>{`${t('Created by')}: ${ownerName}`}</div>
            )}
          </div>
          <div className='buttons'>
            <div className='top-row'>
              {isLoggedInUserPlaylist && !isEditing && (
                <ButtonRectangle label={t('Edit')} onClick={handleEditStart} type='tertiary' />
              )}
              {!isLoggedInUserPlaylist && (
                <ButtonRectangle
                  label={subscribedText}
                  isLoading={isSubscribing}
                  onClick={() => {
                    if (userInfo) {
                      _toggleSubscribeToPlaylist()
                    } else {
                      OmniAural.modalsLoginToAlertShow('subscribe to playlist')
                    }
                  }}
                  type='tertiary'
                />
              )}
              {isEditing && (
                <ButtonRectangle isDanger label={t('Delete')} onClick={handleDeletePlaylistOnServer} type='tertiary' />
              )}
            </div>
            {isLoggedInUserPlaylist && isEditing && (
              <div className='bottom-row'>
                {isEditing && (
                  <>
                    <ButtonRectangle label={t('Cancel')} onClick={handleEditCancel} type='tertiary' />
                    <ButtonRectangle label={t('Save')} onClick={handleEditSave} type='tertiary' />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <hr /> */}
    </>
  )
}
