import { PV } from '~/resources'

export const generateEmbedPlayerIframeHTML = (podcastId?: string, episodeId?: string) => {
  return `<iframe style="height: 580px; max-width: 600px; width: 100%; border: 0;" src="${
    PV.Config.WEB_BASE_URL
  }/embed/player?${podcastId ? `podcastId=${podcastId}` : ''}${podcastId && episodeId ? '&' : ''}${
    episodeId ? `episodeId=${episodeId}` : ''
  }" title="Podverse Embed Player" class="pv-embed-player"></iframe>`
}
