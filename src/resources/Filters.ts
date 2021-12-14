const _all = 'all'
const _category = 'category'
const _episode = 'episode'
const _podcast = 'podcast'
const _subscribed = 'subscribed'

const _host = 'host'

const _alphabetical = 'alphabetical'
const _chronological = 'chronological'
const _mostRecent = 'most-recent'
const _oldest = 'oldest'
const _random = 'random'
const _topPastDay = 'top-past-day'
const _topPastWeek = 'top-past-week'
const _topPastMonth = 'top-past-month'
const _topPastYear = 'top-past-year'
const _topAllTime = 'top-all-time'

const _chapters = 'chapters'
const _clips = 'clips'
const _episodes = 'episodes'
const _myClips = 'my-clips'
const _myPlaylists = 'my-playlists'
const _playlists = 'playlists'
const _podcasts = 'podcasts'

type DropdownOption = {
  label: string
  key: string
}

export const isNotPodcastsAllSortOption = (selectedKey: string) => {
  const allowedKeys = Filters.dropdownOptions.podcasts.sort.all
  return !allowedKeys.find((option: DropdownOption) => option.key === selectedKey)
}

export const isNotPodcastsSubscribedSortOption = (selectedKey: string) => {
  const allowedKeys = Filters.dropdownOptions.podcasts.sort.subscribed
  return !allowedKeys.find((option: DropdownOption) => option.key === selectedKey)
}

export const isNotClipsSortOption = (selectedKey: string) => {
  const allowedKeys = Filters.dropdownOptions.clips.sort.subscribed
  return !allowedKeys.find((option: DropdownOption) => option.key === selectedKey)
}

export const Filters = {
  from: {
    _all,
    _category,
    _episode,
    _podcast,
    _subscribed
  },
  search: {
    queryParams: {
      host: _host,
      podcast: _podcast
    }
  },
  sort: {
    _alphabetical,
    _chronological,
    _mostRecent,
    _oldest,
    _random,
    _topPastDay,
    _topPastWeek,
    _topPastMonth,
    _topPastYear,
    _topAllTime
  },
  type: {
    _chapters,
    _clips,
    _episodes,
    _myClips,
    _myPlaylists,
    _playlists,
    _podcasts
  },
  dropdownOptions: {
    clip: {
      sort: [
        { label: 'Chronological', key: _chronological },
        { label: 'Recent', key: _mostRecent },
        { label: 'Top - Past Day', key: _topPastDay },
        { label: 'Top - Past Week', key: _topPastWeek },
        { label: 'Top - Past Month', key: _topPastMonth },
        { label: 'Top - Past Year', key: _topPastYear },
        { label: 'Top - All Time', key: _topAllTime },
        { label: 'Oldest', key: _oldest },
        { label: 'Random', key: _random }
      ]
    },
    clips: {
      from: [
        { label: 'Subscribed', key: _subscribed }
      ],
      sort: {
        all: [
          { label: 'Top - Past Day', key: _topPastDay },
          { label: 'Top - Past Week', key: _topPastWeek },
          { label: 'Top - Past Month', key: _topPastMonth },
          { label: 'Top - Past Year', key: _topPastYear },
          { label: 'Top - All Time', key: _topAllTime }
        ],
        subscribed: [
          { label: 'Recent', key: _mostRecent },
          { label: 'Top - Past Day', key: _topPastDay },
          { label: 'Top - Past Week', key: _topPastWeek },
          { label: 'Top - Past Month', key: _topPastMonth },
          { label: 'Top - Past Year', key: _topPastYear },
          { label: 'Top - All Time', key: _topAllTime },
          { label: 'Oldest', key: _oldest }
        ]
      }
    },
    episode: {
      sort: [
        { label: 'Chronological', key: _chronological },
        { label: 'Recent', key: _mostRecent },
        { label: 'Top - Past Day', key: _topPastDay },
        { label: 'Top - Past Week', key: _topPastWeek },
        { label: 'Top - Past Month', key: _topPastMonth },
        { label: 'Top - Past Year', key: _topPastYear },
        { label: 'Top - All Time', key: _topAllTime },
        { label: 'Oldest', key: _oldest },
        { label: 'Random', key: _random }
      ]
    },
    episodes: {
      from: [
        { label: 'Subscribed', key: _subscribed }
      ],
      sort: {
        all: [
          { label: 'Top - Past Day', key: _topPastDay },
          { label: 'Top - Past Week', key: _topPastWeek },
          { label: 'Top - Past Month', key: _topPastMonth },
          { label: 'Top - Past Year', key: _topPastYear },
          { label: 'Top - All Time', key: _topAllTime }
        ],
        subscribed: [
          { label: 'Recent', key: _mostRecent },
          { label: 'Top - Past Day', key: _topPastDay },
          { label: 'Top - Past Week', key: _topPastWeek },
          { label: 'Top - Past Month', key: _topPastMonth },
          { label: 'Top - Past Year', key: _topPastYear },
          { label: 'Top - All Time', key: _topAllTime }
        ]
      }
    },
    podcast: {
      from: [
        { label: 'Episodes', key: _episodes },
        { label: 'Clips', key: _clips }
      ],
      sort: [
        { label: 'Recent', key: _mostRecent },
        { label: 'Top - Past Day', key: _topPastDay },
        { label: 'Top - Past Week', key: _topPastWeek },
        { label: 'Top - Past Month', key: _topPastMonth },
        { label: 'Top - Past Year', key: _topPastYear },
        { label: 'Top - All Time', key: _topAllTime },
        { label: 'Oldest', key: _oldest },
        { label: 'Random', key: _random }
      ]
    },
    podcasts: {
      from: [
        { label: 'Subscribed', key: _subscribed }
      ],
      sort: {
        subscribed: [
          { label: 'Alphabetical', key: _alphabetical },
          { label: 'Recent', key: _mostRecent },
          { label: 'Top - Past Day', key: _topPastDay },
          { label: 'Top - Past Week', key: _topPastWeek },
          { label: 'Top - Past Month', key: _topPastMonth },
          { label: 'Top - Past Year', key: _topPastYear },
          { label: 'Top - All Time', key: _topAllTime },
          { label: 'Oldest', key: _oldest }
        ]
      }
    },
    profile: {
      types: [
        { label: 'Podcasts', key: _podcasts },
        { label: 'Clips', key: _clips },
        { label: 'Playlists', key: _playlists }
      ]
    }
  }
}
