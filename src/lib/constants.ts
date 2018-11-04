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

export const mediaListSelectItemsPlayer = [
  {
    href: '#',
    label: 'Clips',
    onClick: () => console.log('clips'),
    value: 'clips',
  },
  {
    href: '#',
    label: 'Episodes',
    onClick: () => console.log('episodes'),
    value: 'episodes',
  }
]

export const mediaListSubSelectItemsPlayer = [
  {
    href: '#',
    label: 'From this podcast',
    onClick: () => console.log('clips from this podcast'),
    value: 'from-podcast'
  },
  {
    href: '#',
    label: 'From this episode',
    onClick: () => console.log('clips from this episode'),
    value: 'from-episode'
  },
  {
    href: '#',
    label: 'All podcasts',
    onClick: () => console.log('all podcasts'),
    value: 'all-podcasts'
  },
  {
    href: '#',
    label: 'Subscribed only',
    onClick: () => console.log('subscribed only'),
    value: 'subscribed-only'
  }
]

export const mediaListSubSelectItemsSort = [
  {
    href: '#',
    label: 'top - past hour',
    onClick: () => console.log('top - past hour'),
    value: 'top-past-hour'
  },
  {
    href: '#',
    label: 'top - past day',
    onClick: () => console.log('top - past day'),
    value: 'top-past-day'
  },
  {
    href: '#',
    label: 'top - past week',
    onClick: () => console.log('top - past week'),
    value: 'top-past-week'
  },
  {
    href: '#',
    label: 'top - past month',
    onClick: () => console.log('top - past month'),
    value: 'top-past-month'
  },
  {
    href: '#',
    label: 'top - past year',
    onClick: () => console.log('top - past year'),
    value: 'top-past-year'
  },
  {
    href: '#',
    label: 'top - all time',
    onClick: () => console.log('top - all time'),
    value: 'top-all-time'
  },
  {
    href: '#',
    label: 'most recent',
    onClick: () => console.log('most recent'),
    value: 'most-recent'
  }
]

export const getClipUrl = (id) => {
  return `/clip/${id}`
}

export const getEpisodeUrl = (id) => {
  return `/episode/${id}`
}

export const getPodcastUrl = (id) => {
  return `/podcast/${id}`
}
