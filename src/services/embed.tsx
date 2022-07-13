import { PV } from '~/resources'

export const generateEmbedPlayerIframeHTML = (podcastId?: string, episodeId?: string, showAllEpisodes?: boolean) => {
  const isEpisodeOnlyPlayer = !!episodeId && !podcastId
  const height = isEpisodeOnlyPlayer ? '170px' : '580px'

  return `<iframe style="height: ${height}; max-width: 600px; width: 100%; border: 0;" src="${
    PV.Config.WEB_BASE_URL
  }/embed/player?${podcastId ? `podcastId=${podcastId}` : ''}${podcastId && episodeId ? '&' : ''}${
    episodeId ? `episodeId=${episodeId}` : ''
  }${showAllEpisodes ? `&showAllEpisodes=true` : ''}" title="Podverse Embed Player" class="pv-embed-player"></iframe>`
}
