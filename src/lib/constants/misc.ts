import membership from "pages/membership"

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
    Login:  'Login',
    Logout: 'Log out',
    dark: 'dark',
    light: 'light',
    TurnOnDark: 'Turn on dark mode',
    TurnOnLight: 'Turn on light mode',
    nsfwMode: 'nsfwMode',
    FromThisPodcast: 'From this podcast',
    FromThisEpisode: 'From this episode'
  },
  attributes: {
    data_theme: 'data-theme',
    is_switching_ui_mode: 'is-switching-ui-mode'
  },
  cookies: {
    showFreeTrialHasEnded: 'showFreeTrialHasEnded',
    showFreeTrialWarning: 'showFreeTrialWarning',
    showMembershipHasEnded: 'showMembershipHasEnded',
    showMembershipWarning: 'showMembershipWarning',
    showEmailVerificationNeeded: 'showEmailVerificationNeeded',
    handleSendVerificationEmailSubmit: 'handleSendVerificationEmailSubmit',
    uiTheme: 'uiTheme',
  },
  errors: {
    login: {
      SubscribeToPodcast: 'Login to subscribe to this podcast.',
      ViewYourSubscriptions: 'Login to view your subscriptions'
    },
    error_429: 'Something went wrong. Please check your internet connection.'
  },
  icons: {
    search: 'search'
  },
  mediaList: {
    now_playing_item: 'now-playing-item',
    now_playing_episode_from_podcast: 'now-playing-item-episode-from-podcast',
    now_playing_episode_from_all_podcasts: 'now-playing-item-episode-from-all-podcasts',
    now_playing_clip_from_episode: 'now-playing-item-clip-from-episode',
    now_playing_clip_from_podcast: 'now-playing-item-clip-from-podcast'
  },
  paths: {
    search: '/search',
    podcasts: '/podcasts',
    episodes: '/episodes',
    clips: '/clips',
    playlists: '/playlists',
    profiles: '/profiles',
    my_profile: '/my-profile',
    my_profile_clips: '/my-profile?type=clips',
    settings: '/settings',
    membership: '/membership'
  },
  query: {
    label:{
      most_recent: 'most recent',
      top_past_day: 'top - past day',
      top_past_week: 'top - past week',
      top_past_month: 'top - past month',
      top_past_year: 'top - past year',
      top_all_time: 'top - all time',
      random: 'random',
      Subscribed: 'Subscribed',
      AllPodcasts: 'All Podcasts',
      Categories: 'Categories',
      All: 'All'
    },
    from_episode: 'from-episode',
    from_podcast: 'from-podcast',
    from_category: 'from-category',
    all_podcasts: 'all-podcasts',
    subscribed_only: 'subscribed-only',
    episodes: 'episodes',
    clips: 'clips',
    podcasts: 'podcasts',
    most_recent: 'most-recent',
    top_past_day: 'top-past-day',
    top_past_week: 'top-past-week',
    top_past_month: 'top-past-month',
    top_past_year: 'top-past-year',
    top_all_time: 'top-all-time',
    random: 'random',
    chronological: 'chronological',
    oldest: 'oldest',
    no_results: 'no-results'

  }
}