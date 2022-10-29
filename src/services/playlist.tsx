import { Episode, MediaRef } from 'podverse-shared'
import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { request } from '~/services/request'

export const getServerSideLoggedInUserPlaylistsCombined = async (cookies: any) => {
  let combinedPlaylists = {
    createdPlaylists: [],
    subscribedPlaylists: []
  }
  if (cookies.Authorization) {
    combinedPlaylists = await getLoggedInUserPlaylistsCombinedFromServer(cookies.Authorization)
  }
  return combinedPlaylists
}

const getLoggedInUserPlaylistsCombinedFromServer = async (bearerToken?: string) => {
  const response = await request({
    endpoint: '/user/playlists/combined',
    ...getAuthCredentialsHeaders(bearerToken)
  })
  const { createdPlaylists, subscribedPlaylists } = response.data
  return { createdPlaylists, subscribedPlaylists }
}

export const getLoggedInUserPlaylists = async (bearerToken?: string) => {
  const response = await request({
    endpoint: '/user/playlists',
    ...getAuthCredentialsHeaders(bearerToken)
  })

  return response && response.data
}

export const getUserPlaylists = async (userId: string, page = 1) => {
  const response = await request({
    endpoint: `/user/${userId}/playlists`,
    query: { page }
  })

  return response && response.data
}

export const getPlaylist = async (playlistId: string) => {
  const response = await request({
    endpoint: `/playlist/${playlistId}`
  })

  return response && response.data
}

export const combineAndSortPlaylistItems = (episodes: Episode[], mediaRefs: MediaRef[], itemsOrder: string[]) => {
  const allPlaylistItems = [...episodes, ...mediaRefs]
  const remainingPlaylistItems = []

  const unsortedItems = allPlaylistItems.filter((x: any) => {
    const isSortedItem = Array.isArray(itemsOrder) && itemsOrder.some((id) => x.id === id)
    if (!isSortedItem) {
      return x
    } else if (x) {
      remainingPlaylistItems.push(x)
    }
  })

  const sortedItems = itemsOrder.reduce((results: any[], id: string) => {
    const items = remainingPlaylistItems.filter((x: any) => x.id === id)
    if (items.length > 0) {
      results.push(items[0])
    }
    return results
  }, [])

  return [...sortedItems, ...unsortedItems]
}

export const toggleSubscribeToPlaylistOnServer = async (playlistId: string) => {
  const response = await request({
    endpoint: `/playlist/toggle-subscribe/${playlistId}`,
    ...getAuthCredentialsHeaders()
  })

  return response && response.data
}

export const updatePlaylist = async (data: any) => {
  const response = await request({
    endpoint: '/playlist',
    method: 'PATCH',
    ...getAuthCredentialsHeaders(),
    body: data
  })

  return response && response.data
}

export const deletePlaylistOnServer = async (id: string) => {
  const response = await request({
    endpoint: `/playlist/${id}`,
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })

  return response && response.data
}

export const addOrRemovePlaylistItemEpisode = async (playlistId: string, episodeId?: string) => {
  const data = {
    playlistId,
    episodeId
  }

  const response = await request({
    endpoint: '/playlist/add-or-remove',
    method: 'PATCH',
    ...getAuthCredentialsHeaders(),
    body: data
  })

  return response && response.data
}

export const addOrRemovePlaylistItemMediaRef = async (playlistId: string, mediaRefId?: string) => {
  const data = {
    playlistId,
    mediaRefId
  }

  const response = await request({
    endpoint: '/playlist/add-or-remove',
    method: 'PATCH',
    ...getAuthCredentialsHeaders(),
    body: data
  })

  return response && response.data
}

export const createPlaylist = async (data: any) => {
  const response = await request({
    endpoint: '/playlist',
    method: 'POST',
    ...getAuthCredentialsHeaders(),
    body: data
  })

  return response && response.data
}
