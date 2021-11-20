import { useRouter } from 'next/router'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Playlist } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deletePlaylistOnServer, toggleSubscribeToPlaylistOnServer } from '~/services/playlist'
import { ButtonRectangle, TextInput } from '..'

type Props = {
  handleEditCancel: any
  handleEditSave: any
  handleEditStart: any
  handlePlaylistTitleOnChange: any
  isEditing?: boolean
  playlist: Playlist
}

export const PlaylistPageHeader = ({ handleEditCancel, handleEditSave,
  handleEditStart, handlePlaylistTitleOnChange, isEditing, playlist }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const title = playlist?.title || t('untitledPlaylist')
  const ownerName = playlist?.owner?.name || t('Anonymous')
  const itemCount = playlist?.itemCount || 0
  const isLoggedInUserPlaylist = userInfo?.id && userInfo.id === playlist?.owner?.id
  const isSubscribed = userInfo?.subscribedPodcastIds?.includes(playlist.id)
  const subscribedText = isSubscribed ? t('Unsubscribe') : t('Subscribe')
  const editButtonText = isEditing ? t('Save') : t('Edit')
  const handleEditToggleButton = isEditing ? handleEditSave : handleEditStart

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

  return (
    <div
      className='playlist-page-header'>
      <div className='main-max-width'>
        <div className='text-wrapper'>
          {
            isEditing ? (
              <TextInput
                defaultValue={playlist.title}
                label={t('Playlist Title')}
                noMarginOrPadding
                onChange={handlePlaylistTitleOnChange}
                onSubmit={handleEditSave}
                placeholder={t('Playlist Title')}
                type='email' />
            ) : (
              <h1>{title}</h1>
            )
          }
          {
            !isEditing && (
              <div className='items-count'>{`${t('Items')}: ${itemCount}`}</div>
            )
          }
          {
            !isLoggedInUserPlaylist && (
              <div className='owner-name'>{`${t('Created by')}: ${ownerName}`}</div>
            )
          }
        </div>
        <div className='buttons'>
          {
            isEditing && (
              <div className='top-row'>
                <ButtonRectangle
                  isDanger
                  label={t('Delete')}
                  onClick={handleDeletePlaylistOnServer}
                  type='tertiary' />
              </div>
            )
          }
          <div className='bottom-row'>
            {
              isLoggedInUserPlaylist && isEditing && (
                <ButtonRectangle
                  label={t('Cancel')}
                  onClick={handleEditCancel}
                  type='tertiary' />
              )
            }
            {
              isLoggedInUserPlaylist && (
                <ButtonRectangle
                  label={editButtonText}
                  onClick={handleEditToggleButton}
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
      </div>
    </div>
  )
}
