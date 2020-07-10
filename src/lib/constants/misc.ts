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

/* MediaPlayer */
export const kAutoplay = 'mediaPlayerAutoplay'
export const kPlaybackRate = 'mediaPlayerPlaybackRate'

export const getPlaybackRateText = num => {
  switch (num) {
    case 0.5:
      return '0.5x'
    case 0.75:
      return '0.75x'
    case 1:
      return '1x'
    case 1.25:
      return '1.25x'
    case 1.5:
      return '1.5x'
    case 2:
      return '2x'
    default:
      return '1x'
  }
}

export const getPlaybackRateNextValue = num => {
  switch (num) {
    case 0.5:
      return 0.75
    case 0.75:
      return 1
    case 1:
      return 1.25
    case 1.25:
      return 1.5
    case 1.5:
      return 2
    case 2:
      return 0.5
    default:
      return 1
  }
}

export const internetConnectivityErrorMessage = 'Error: Please check your internet connection and try again later.'

export const constants = {
  core: {
    Podcasts: 'Podcasts',
    Episodes: 'Episodes',
    Clips: 'Clips',
    Playlists: 'Playlists',
    Profiles: 'Profiles',
    MyProfile: 'My Profile',
    MyClips: 'My Clips',
    Settings: 'Settings',
    Premium: 'Premium',
    PremiumFreeTrial: 'Premium (Free Trial)',
    Login:  'Login'

  },
  pages: {
    Home: {}
  }
}