import OmniAural from 'omniaural'
import { PV } from '~/resources'

const modalsShareHide = () => {
  OmniAural.state.modals.share.items.set(null)
}

const generateShareUrl = (id: string, path: string) => `${PV.Config.WEB_BASE_URL}${path}/${id}`

const modalsShareShowChapter = (mediaRefId: string, episodeId: string, podcastId: string) => {
  OmniAural.modalsHideAll()

  const items = [
    {
      label: 'Chapter',
      url: generateShareUrl(mediaRefId, PV.RoutePaths.web.clip)
    },
    {
      label: 'Episode',
      url: generateShareUrl(episodeId, PV.RoutePaths.web.episode)
    },
    {
      label: 'Podcast',
      url: generateShareUrl(podcastId, PV.RoutePaths.web.podcast)
    }
  ]

  OmniAural.state.modals.share.items.set(items)
}

const modalsShareShowClip = (mediaRefId: string, episodeId: string, podcastId: string) => {
  OmniAural.modalsHideAll()

  const items = [
    {
      label: 'Clip',
      url: generateShareUrl(mediaRefId, PV.RoutePaths.web.clip)
    },
    {
      label: 'Episode',
      url: generateShareUrl(episodeId, PV.RoutePaths.web.episode)
    },
    {
      label: 'Podcast',
      url: generateShareUrl(podcastId, PV.RoutePaths.web.podcast)
    }
  ]

  OmniAural.state.modals.share.items.set(items)
}

const modalsShareShowEpisode = (episodeId: string, podcastId: string) => {
  OmniAural.modalsHideAll()

  const items = [
    {
      label: 'Episode',
      url: generateShareUrl(episodeId, PV.RoutePaths.web.episode)
    },
    {
      label: 'Podcast',
      url: generateShareUrl(podcastId, PV.RoutePaths.web.podcast)
    }
  ]

  OmniAural.state.modals.share.items.set(items)
}

const modalsShareShowPlaylist = (playlistId: string) => {
  OmniAural.modalsHideAll()

  const items = [
    {
      label: 'Playlist',
      url: generateShareUrl(playlistId, PV.RoutePaths.web.playlist)
    }
  ]

  OmniAural.state.modals.share.items.set(items)
}

const modalsShareShowPodcast = (podcastId: string) => {
  OmniAural.modalsHideAll()

  const items = [
    {
      label: 'Podcast',
      url: generateShareUrl(podcastId, PV.RoutePaths.web.podcast)
    }
  ]

  OmniAural.state.modals.share.items.set(items)
}

const modalsShareShowUser = (userId: string) => {
  OmniAural.modalsHideAll()

  const items = [
    {
      label: 'Profile',
      url: generateShareUrl(userId, PV.RoutePaths.web.profile)
    }
  ]

  OmniAural.state.modals.share.items.set(items)
}

OmniAural.addActions({
  modalsShareHide,
  modalsShareShowChapter,
  modalsShareShowClip,
  modalsShareShowEpisode,
  modalsShareShowPlaylist,
  modalsShareShowPodcast,
  modalsShareShowUser
})
