import OmniAural, { useOmniAural } from 'omniaural'
import type { Playlist } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { ButtonClose, ButtonLink, ButtonRectangle, PlaylistListItem } from '~/components'
import {
  addOrRemovePlaylistItemEpisode,
  addOrRemovePlaylistItemMediaRef,
  createPlaylist,
  getLoggedInUserPlaylists
} from '~/services/playlist'

type Props = {}

const keyPrefix = '_addToPlaylist'

export const AddToPlaylistModal = (props: Props) => {
  const [addToPlaylist] = useOmniAural('modals.addToPlaylist')
  const { t } = useTranslation()
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  /* Function Helpers */

  const _handleCreatePlaylist = async () => {
    const title = window.prompt(t('Type a title for your playlist'))
    // title will be null if user presses Cancel
    if (title !== null) {
      const newPlaylist = await createPlaylist({ title })
      const newPlaylists = [newPlaylist, ...playlists]
      setPlaylists(newPlaylists)
    }
  }

  const _handlePlaylistResponse = async (response: any) => {
    const { playlistId, playlistItemCount } = response
    const newPlaylists = playlists.map((playlist: Playlist) => {
      if (playlistId !== playlist.id) {
        return playlist
      } else {
        playlist.itemCount = playlistItemCount
        return playlist
      }
    })
    setPlaylists(newPlaylists)
  }

  const _handlePlaylistPress = async (playlist: Playlist) => {
    const { item } = addToPlaylist
    OmniAural.pageIsLoadingShow()
    if (item.clipId) {
      const response = await addOrRemovePlaylistItemMediaRef(playlist.id, item.clipId)
      await _handlePlaylistResponse(response)
    } else if (item.episodeId) {
      const response = await addOrRemovePlaylistItemEpisode(playlist.id, item.episodeId)
      await _handlePlaylistResponse(response)
    }
    OmniAural.pageIsLoadingHide()
  }

  const _onAfterOpen = async () => {
    OmniAural.pageIsLoadingShow()
    const response = await getLoggedInUserPlaylists()
    const [playlists, playlistsCount] = response
    setPlaylists(playlists)
    OmniAural.pageIsLoadingHide()
  }

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  /* Render Helpers */

  const generatePlaylistElements = (listItems: Playlist[]) => {
    return listItems.map((listItem, index) => (
      <AddToPlaylistListItem
        key={`${keyPrefix}-${index}`}
        onClick={() => _handlePlaylistPress(listItem)}
        playlist={listItem}
      />
    ))
  }

  return (
    <Modal
      className='add-to-playlist-modal centered'
      contentLabel={t('Add to Playlist')}
      isOpen={!!addToPlaylist.item}
      onAfterOpen={_onAfterOpen}
      onRequestClose={_onRequestClose}
    >
      <h2>{t('Add to Playlist')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      <div className='playlists-wrapper'>
        <ButtonLink label={t('Create Playlist')} onClick={_handleCreatePlaylist} />
        {generatePlaylistElements(playlists)}
      </div>
    </Modal>
  )
}

type ListItemProps = {
  onClick: any
  playlist: Playlist
}

const AddToPlaylistListItem = ({ onClick, playlist }: ListItemProps) => {
  const { t } = useTranslation()
  const title = playlist?.title ? playlist.title : t('untitledPlaylist')
  const itemCount = playlist?.itemCount || 0

  return (
    <>
      <li className='add-to-playlist-list-item' onClick={onClick}>
        <div className='title'>{title}</div>
        <div className='items-count'>{`${t('Items')}: ${itemCount}`}</div>
      </li>
      <hr />
    </>
  )
}
