import { request } from "~/services/request"

export const getServerSideLoggedInUserPlaylistsCombined = async (cookies: any) => {
  let combinedPlaylists = {
    createdPlaylists: [],
    subscribedPlaylists: []
  }
  if (cookies.Authorization) {
    combinedPlaylists =
      await getLoggedInUserPlaylistsCombinedFromServer(cookies.Authorization)
  }
  return combinedPlaylists
}

const getLoggedInUserPlaylistsCombinedFromServer = async (bearerToken?: string) => {
  const response = await request({
    endpoint: '/user/playlists/combined',
    headers: { Authorization: bearerToken }
  })
  const { createdPlaylists, subscribedPlaylists } = response.data
  return { createdPlaylists, subscribedPlaylists }
}
