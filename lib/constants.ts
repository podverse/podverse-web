const routeApps = {
  ADMIN: '/admin',
  DEV: '/dev',
  MAIN: '/main'
}

export const routeFilePaths = {
  ADMIN: '',
  DEV: '',
  MAIN: {
    CLIP: `${routeApps.MAIN}/clip`,
    CLIPS: `${routeApps.MAIN}/clips`,
    EPISODE: `${routeApps.MAIN}/episode`,
    PLAYLIST: `${routeApps.MAIN}/playlist`,
    PLAYLISTS: `${routeApps.MAIN}/playlists`,
    PODCAST: `${routeApps.MAIN}/podcast`,
    PODCASTS: `${routeApps.MAIN}/podcasts`
  }
}

export const routePagePaths = {
  ADMIN: '',
  DEV: '',
  MAIN: {
    CLIP: `/clip`,
    CLIPS: `/clips`,
    EPISODE: `/episode`,
    PLAYLIST: `/playlist`,
    PLAYLISTS: `/playlists`,
    PODCAST: `/podcast`,
    PODCASTS: `/podcasts`
  }
}