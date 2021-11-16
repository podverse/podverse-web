export const Filters = {
  from: {
    _all: 'all',
    _category: 'category',
    _episode: 'episode',
    _podcast: 'podcast',
    _subscribed: 'subscribed',
  },
  search: {
    queryParams: {
      host: 'host',
      podcast: 'podcast'
    }
  },
  sort: {
    _alphabetical: 'alphabetical',
    _chronological: 'chronological',
    _mostRecent: 'most-recent',
    _oldest: 'oldest',
    _random: 'random',
    _topPastDay: 'top-past-day',
    _topPastWeek: 'top-past-week',
    _topPastMonth: 'top-past-month',
    _topPastYear: 'top-past-year',
    _topAllTime: 'top-all-time'
  },
  type: {
    _chapters: 'chapters',
    _clips: 'clips',
    _episodes: 'episodes',
    _myClips: 'my-clips',
    _myPlaylists: 'my-playlists',
    _playlists: 'playlists',
    _podcasts: 'podcasts',
  }
}
